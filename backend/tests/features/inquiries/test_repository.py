from dataclasses import dataclass
from typing import Any
from uuid import UUID

from app.features.inquiries.models import InquiryIntent, InquiryStatus
from app.features.inquiries.repository import InquiryRepository

OPERATOR_ID = UUID("00000000-0000-4000-8000-000000000001")


@dataclass
class FakeResponse:
    data: list[dict[str, Any]]
    count: int | None = None


class FakeQuery:
    def __init__(self, response: FakeResponse) -> None:
        self.response = response
        self.operations: list[tuple[Any, ...]] = []

    def select(self, columns: str, *, count: str) -> "FakeQuery":
        self.operations.append(("select", columns, count))
        return self

    def eq(self, column: str, value: str) -> "FakeQuery":
        self.operations.append(("eq", column, value))
        return self

    def or_(self, filters: str) -> "FakeQuery":
        self.operations.append(("or", filters))
        return self

    def order(self, column: str, *, desc: bool) -> "FakeQuery":
        self.operations.append(("order", column, desc))
        return self

    def range(self, start: int, end: int) -> "FakeQuery":
        self.operations.append(("range", start, end))
        return self

    def execute(self) -> FakeResponse:
        self.operations.append(("execute",))
        return self.response


class FakeSupabaseClient:
    def __init__(
        self,
        list_response: FakeResponse,
        status_response: FakeResponse,
    ) -> None:
        self.list_query = FakeQuery(list_response)
        self.status_query = FakeQuery(status_response)
        self.table_name: str | None = None
        self.rpc_name: str | None = None
        self.rpc_params: dict[str, str] | None = None

    def table(self, name: str) -> FakeQuery:
        self.table_name = name
        return self.list_query

    def rpc(self, name: str, params: dict[str, str]) -> FakeQuery:
        self.rpc_name = name
        self.rpc_params = params
        return self.status_query


def test_list_inquiries_applies_filters_pagination_and_global_status_counts() -> None:
    client = FakeSupabaseClient(
        list_response=FakeResponse(
            data=[
                {
                    "id": "10000000-0000-4000-8000-000000000003",
                    "customer_name": "박교환",
                    "customer_email": "exchange@example.com",
                    "subject": "교환 문의",
                    "preview": "사이즈 교환을 원합니다.",
                    "intent": "EXCHANGE",
                    "status": "ACTION_REQUIRED",
                    "stage": "WAITING_APPROVAL",
                    "received_at": "2026-07-27T11:00:00+00:00",
                }
            ],
            count=5,
        ),
        status_response=FakeResponse(
            data=[
                {
                    "all_count": 6,
                    "in_progress_count": 1,
                    "action_required_count": 4,
                    "completed_count": 1,
                }
            ]
        ),
    )

    response = InquiryRepository(client, OPERATOR_ID).list_inquiries(
        search="교환",
        status=InquiryStatus.ACTION_REQUIRED,
        intent=InquiryIntent.EXCHANGE,
        page=2,
        page_size=2,
    )

    assert response.total_count == 5
    assert response.total_pages == 3
    assert response.status_counts.ACTION_REQUIRED == 4
    assert client.table_name == "inquiries"
    assert client.rpc_name == "get_inquiry_status_counts"
    assert client.rpc_params == {"p_operator_id": str(OPERATOR_ID)}
    assert (
        "eq",
        "gmail_connections.operator_id",
        str(OPERATOR_ID),
    ) in client.list_query.operations
    assert ("eq", "status", "ACTION_REQUIRED") in client.list_query.operations
    assert ("eq", "intent", "EXCHANGE") in client.list_query.operations
    assert ("order", "received_at", True) in client.list_query.operations
    assert ("range", 2, 3) in client.list_query.operations
    assert (
        "or",
        'customer_name.ilike."%교환%",customer_email.ilike."%교환%",'
        'subject.ilike."%교환%",preview.ilike."%교환%"',
    ) in client.list_query.operations


def test_list_inquiries_escapes_search_pattern_characters() -> None:
    client = FakeSupabaseClient(
        list_response=FakeResponse(data=[], count=0),
        status_response=FakeResponse(
            data=[
                {
                    "all_count": 0,
                    "in_progress_count": 0,
                    "action_required_count": 0,
                    "completed_count": 0,
                }
            ]
        ),
    )

    InquiryRepository(client, OPERATOR_ID).list_inquiries(
        search='50%,_"\\',
        page=1,
        page_size=5,
    )

    search_operation = next(
        operation for operation in client.list_query.operations if operation[0] == "or"
    )
    assert search_operation[1] == (
        'customer_name.ilike."%50\\%\\,\\_\\"\\\\%",'
        'customer_email.ilike."%50\\%\\,\\_\\"\\\\%",'
        'subject.ilike."%50\\%\\,\\_\\"\\\\%",'
        'preview.ilike."%50\\%\\,\\_\\"\\\\%"'
    )
