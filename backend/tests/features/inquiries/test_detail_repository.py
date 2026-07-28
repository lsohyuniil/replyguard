from dataclasses import dataclass
from typing import Any
from uuid import UUID

import pytest

from app.features.inquiries.detail_repository import (
    InquiryDetailRepository,
    InquiryNotFoundError,
)


@dataclass
class FakeResponse:
    data: Any


class FakeQuery:
    def __init__(self, response: FakeResponse) -> None:
        self._response = response
        self.operations: list[tuple[Any, ...]] = []

    def select(self, columns: str) -> "FakeQuery":
        self.operations.append(("select", columns))
        return self

    def eq(self, column: str, value: str) -> "FakeQuery":
        self.operations.append(("eq", column, value))
        return self

    def order(self, column: str, *, desc: bool = False) -> "FakeQuery":
        self.operations.append(("order", column, desc))
        return self

    def limit(self, count: int) -> "FakeQuery":
        self.operations.append(("limit", count))
        return self

    def maybe_single(self) -> "FakeQuery":
        self.operations.append(("maybe_single",))
        return self

    def execute(self) -> FakeResponse:
        self.operations.append(("execute",))
        return self._response


class FakeSupabaseClient:
    def __init__(self, responses: dict[str, FakeResponse]) -> None:
        self.queries = {
            table_name: FakeQuery(response)
            for table_name, response in responses.items()
        }
        self.table_names: list[str] = []

    def table(self, name: str) -> FakeQuery:
        self.table_names.append(name)
        return self.queries[name]


def inquiry_row() -> dict[str, Any]:
    return {
        "id": "30000000-0000-4000-8000-000000000003",
        "gmail_thread_id": "thread_exchange_resumed",
        "customer_name": "최유나",
        "customer_email": "yuna.choi@example.com",
        "subject": "셔츠를 다른 사이즈로 교환하고 싶습니다",
        "preview": "M 사이즈로 교환하고 싶습니다.",
        "intent": "EXCHANGE",
        "status": "ACTION_REQUIRED",
        "stage": "WAITING_APPROVAL",
        "completion_type": None,
        "collected_information": {
            "desired_size": "M",
            "worn_or_washed": False,
        },
        "required_action": {
            "type": "REVIEW_DRAFT",
            "label": "교환 답변 검토",
        },
        "active_agent_run_id": "40000000-0000-4000-8000-000000000003",
        "received_at": "2026-07-16T02:10:00Z",
        "updated_at": "2026-07-16T03:02:12Z",
        "order": order_row(),
    }


def order_row() -> dict[str, Any]:
    return {
        "id": "10000000-0000-4000-8000-000000001003",
        "order_number": "RG-20260709-1003",
        "customer_email": "yuna.choi@example.com",
        "status": "COMPLETED",
        "ordered_at": "2026-07-09T01:00:00Z",
        "currency": "KRW",
        "total_amount": 59000,
        "order_items": [
            {
                "id": "11000000-0000-4000-8000-000000001003",
                "sku": "SHIRT-LINEN-L",
                "name": "린넨 셔츠",
                "quantity": 1,
                "unit_price": 59000,
            }
        ],
        "shipments": [
            {
                "id": "12000000-0000-4000-8000-000000001003",
                "carrier": "CJ대한통운",
                "tracking_number": "555000000003",
                "status": "DELIVERED",
                "shipped_at": "2026-07-10T01:00:00Z",
                "estimated_delivery_at": "2026-07-12T09:00:00Z",
                "delivered_at": "2026-07-12T03:00:00Z",
                "latest_event": "배송 완료",
            }
        ],
    }


def fake_client(inquiry: dict[str, Any] | None) -> FakeSupabaseClient:
    return FakeSupabaseClient(
        {
            "inquiries": FakeResponse(inquiry),
            "inquiry_messages": FakeResponse(
                [
                    {
                        "id": "31000000-0000-4000-8000-000000000005",
                        "direction": "INBOUND",
                        "sender_name": "최유나",
                        "sender_email": "yuna.choi@example.com",
                        "body_text": "셔츠를 교환하고 싶습니다.",
                        "occurred_at": "2026-07-16T02:10:00Z",
                        "attachments": [],
                    }
                ]
            ),
            "inquiry_order_candidates": FakeResponse([]),
            "inquiry_policy_versions": FakeResponse(
                [
                    {
                        "policy_version": {
                            "id": "21000000-0000-4000-8000-000000000002",
                            "version": 2,
                            "status": "ACTIVE",
                            "content": "교환 정책 원문",
                            "published_at": "2026-07-02T00:00:00Z",
                            "policy": {
                                "id": "20000000-0000-4000-8000-000000000002",
                                "category": "EXCHANGE",
                                "title": "의류 교환 정책",
                            },
                            "policy_chunks": [
                                {
                                    "id": "22000000-0000-4000-8000-000000000002",
                                    "chunk_index": 0,
                                    "content": "교환 가능 조건",
                                    "metadata": {"section": "교환 가능 조건"},
                                }
                            ],
                        }
                    }
                ]
            ),
            "agent_runs": FakeResponse(
                {
                    "id": "40000000-0000-4000-8000-000000000003",
                    "status": "INTERRUPTED",
                    "step_count": 8,
                    "resume_count": 1,
                    "error_code": None,
                    "started_at": "2026-07-16T02:10:01Z",
                    "resumed_at": "2026-07-16T03:02:01Z",
                    "finished_at": None,
                }
            ),
            "answer_drafts": FakeResponse(
                [
                    {
                        "id": "41000000-0000-4000-8000-000000000002",
                        "version": 1,
                        "ai_content": "교환 접수를 안내드리겠습니다.",
                        "final_content": None,
                        "evidence": [],
                        "status": "WAITING_APPROVAL",
                        "created_at": "2026-07-16T03:02:10Z",
                    }
                ]
            ),
        }
    )


def test_get_detail_combines_inquiry_relations_and_sorted_lists() -> None:
    client = fake_client(inquiry_row())
    inquiry_id = UUID("30000000-0000-4000-8000-000000000003")

    detail = InquiryDetailRepository(client).get_detail(inquiry_id)

    assert detail.id == inquiry_id
    assert detail.order is not None
    assert detail.order.items[0].sku == "SHIRT-LINEN-L"
    assert detail.order.shipment is not None
    assert detail.order.shipment.tracking_number == "555000000003"
    assert detail.policies[0].title == "의류 교환 정책"
    assert detail.agent_run is not None
    assert detail.answer_draft is not None
    assert client.table_names == [
        "inquiries",
        "inquiry_messages",
        "inquiry_order_candidates",
        "inquiry_policy_versions",
        "agent_runs",
        "answer_drafts",
    ]
    assert (
        "order",
        "occurred_at",
        False,
    ) in client.queries["inquiry_messages"].operations
    assert ("order", "version", True) in client.queries["answer_drafts"].operations
    assert ("limit", 1) in client.queries["answer_drafts"].operations


def test_get_detail_stops_when_inquiry_does_not_exist() -> None:
    client = fake_client(None)

    with pytest.raises(InquiryNotFoundError):
        InquiryDetailRepository(client).get_detail(
            UUID("30000000-0000-4000-8000-000000000099")
        )

    assert client.table_names == ["inquiries"]
