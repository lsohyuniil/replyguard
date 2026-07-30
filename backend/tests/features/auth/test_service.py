from typing import Any
from uuid import UUID

import pytest

from app.features.auth.models import AuthenticatedUser
from app.features.auth.service import (
    AuthProviderUnavailableError,
    InvalidAccessTokenError,
    SupabaseAuthService,
)


class FakeAuthClient:
    def __init__(
        self,
        response: dict[str, Any] | None = None,
        error: Exception | None = None,
    ) -> None:
        self.response = response
        self.error = error
        self.received_token: str | None = None

    def get_claims(self, token: str) -> dict[str, Any] | None:
        self.received_token = token
        if self.error is not None:
            raise self.error
        return self.response


class FakeSupabaseClient:
    def __init__(self, auth: FakeAuthClient) -> None:
        self.auth = auth


def valid_claims() -> dict[str, Any]:
    return {
        "sub": "90000000-0000-4000-8000-000000000001",
        "email": "operator@example.com",
        "role": "authenticated",
        "aud": "authenticated",
        "iss": "https://project-ref.supabase.co/auth/v1",
    }


def test_verify_access_token_returns_authenticated_user() -> None:
    auth = FakeAuthClient({"claims": valid_claims(), "headers": {}, "signature": b""})
    service = SupabaseAuthService(
        FakeSupabaseClient(auth),
        supabase_url="https://project-ref.supabase.co",
    )

    user = service.verify_access_token("valid-token")

    assert user == AuthenticatedUser(
        id=UUID("90000000-0000-4000-8000-000000000001"),
    )
    assert auth.received_token == "valid-token"


@pytest.mark.parametrize(
    "claims",
    [
        None,
        {},
        {**valid_claims(), "sub": "not-a-uuid"},
        {**valid_claims(), "role": "anon"},
        {**valid_claims(), "aud": "anon"},
        {**valid_claims(), "iss": "https://other.supabase.co/auth/v1"},
    ],
)
def test_verify_access_token_rejects_invalid_claims(
    claims: dict[str, Any] | None,
) -> None:
    response = (
        {"claims": claims, "headers": {}, "signature": b""}
        if claims is not None
        else None
    )
    service = SupabaseAuthService(
        FakeSupabaseClient(FakeAuthClient(response)),
        supabase_url="https://project-ref.supabase.co",
    )

    with pytest.raises(InvalidAccessTokenError):
        service.verify_access_token("invalid-token")


def test_verify_access_token_hides_provider_error() -> None:
    service = SupabaseAuthService(
        FakeSupabaseClient(FakeAuthClient(error=RuntimeError("secret-provider-error"))),
        supabase_url="https://project-ref.supabase.co",
    )

    with pytest.raises(AuthProviderUnavailableError) as raised:
        service.verify_access_token("invalid-token")

    assert "secret-provider-error" not in str(raised.value)
