from typing import Any
from uuid import UUID

from supabase import Client
from supabase_auth.errors import AuthError, AuthRetryableError

from app.features.auth.models import AuthenticatedUser


class InvalidAccessTokenError(Exception):
    pass


class AuthProviderUnavailableError(Exception):
    pass


class SupabaseAuthService:
    def __init__(self, client: Client, *, supabase_url: str) -> None:
        self._client = client
        self._issuer = f"{supabase_url.rstrip('/')}/auth/v1"

    def verify_access_token(self, token: str) -> AuthenticatedUser:
        try:
            response = self._client.auth.get_claims(token)
            claims = response.get("claims") if response is not None else None
            return self._to_authenticated_user(claims)
        except InvalidAccessTokenError:
            raise
        except AuthRetryableError as exc:
            raise AuthProviderUnavailableError(
                "authentication provider unavailable"
            ) from exc
        except AuthError as exc:
            raise InvalidAccessTokenError("invalid access token") from exc
        except Exception as exc:
            raise AuthProviderUnavailableError(
                "authentication provider unavailable"
            ) from exc

    def _to_authenticated_user(
        self,
        claims: dict[str, Any] | None,
    ) -> AuthenticatedUser:
        if not claims:
            raise InvalidAccessTokenError("invalid access token")

        audience = claims.get("aud")
        audience_values = audience if isinstance(audience, list) else [audience]
        if (
            claims.get("role") != "authenticated"
            or "authenticated" not in audience_values
            or claims.get("iss") != self._issuer
        ):
            raise InvalidAccessTokenError("invalid access token")

        try:
            return AuthenticatedUser(
                id=UUID(str(claims["sub"])),
            )
        except (KeyError, TypeError, ValueError) as exc:
            raise InvalidAccessTokenError("invalid access token") from exc
