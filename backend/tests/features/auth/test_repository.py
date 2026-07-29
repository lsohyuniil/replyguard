from dataclasses import dataclass
from typing import Any
from uuid import UUID

import pytest

from app.features.auth.repository import (
    OperatorNotLinkedError,
    OperatorRepository,
)


@dataclass
class FakeResponse:
    data: dict[str, Any] | None


class FakeQuery:
    def __init__(self, response: FakeResponse) -> None:
        self.response = response
        self.operations: list[tuple[Any, ...]] = []

    def select(self, columns: str) -> "FakeQuery":
        self.operations.append(("select", columns))
        return self

    def eq(self, column: str, value: str) -> "FakeQuery":
        self.operations.append(("eq", column, value))
        return self

    def maybe_single(self) -> "FakeQuery":
        self.operations.append(("maybe_single",))
        return self

    def execute(self) -> FakeResponse:
        self.operations.append(("execute",))
        return self.response


class FakeSupabaseClient:
    def __init__(self, response: FakeResponse) -> None:
        self.query = FakeQuery(response)

    def table(self, name: str) -> FakeQuery:
        assert name == "operators"
        return self.query


def test_get_by_auth_user_id_returns_linked_operator() -> None:
    client = FakeSupabaseClient(
        FakeResponse(
            {
                "id": "00000000-0000-4000-8000-000000000001",
                "auth_user_id": "90000000-0000-4000-8000-000000000001",
                "email": "operator@example.com",
                "name": "ReplyGuard 운영자",
            }
        )
    )

    operator = OperatorRepository(client).get_by_auth_user_id(
        UUID("90000000-0000-4000-8000-000000000001")
    )

    assert operator.id == UUID("00000000-0000-4000-8000-000000000001")
    assert ("eq", "auth_user_id", "90000000-0000-4000-8000-000000000001") in (
        client.query.operations
    )


def test_get_by_auth_user_id_rejects_unlinked_user() -> None:
    client = FakeSupabaseClient(FakeResponse(None))

    with pytest.raises(OperatorNotLinkedError):
        OperatorRepository(client).get_by_auth_user_id(
            UUID("90000000-0000-4000-8000-000000000099")
        )
