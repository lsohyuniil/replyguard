from datetime import UTC, datetime
from uuid import UUID

import pytest
from pydantic import ValidationError

from app.features.inquiries.models import (
    InquiryListItem,
    InquiryListResponse,
    InquiryStage,
    InquiryStatus,
    InquiryStatusCounts,
)


def test_inquiry_list_response_calculates_total_pages() -> None:
    item = InquiryListItem(
        id=UUID("10000000-0000-4000-8000-000000000001"),
        customer_name="김고객",
        customer_email="customer@example.com",
        subject="배송 상태를 알고 싶어요",
        preview="주문한 상품은 언제 도착하나요?",
        intent="DELIVERY_STATUS",
        status="IN_PROGRESS",
        stage="ANALYZING",
        received_at=datetime(2026, 7, 27, 9, 0, tzinfo=UTC),
    )

    response = InquiryListResponse(
        items=[item],
        page=2,
        page_size=2,
        total_count=5,
        status_counts=InquiryStatusCounts(
            ALL=6,
            IN_PROGRESS=1,
            ACTION_REQUIRED=4,
            COMPLETED=1,
        ),
    )

    assert response.total_pages == 3
    assert response.items[0].stage is InquiryStage.ANALYZING


def test_inquiry_list_item_rejects_unknown_status() -> None:
    with pytest.raises(ValidationError):
        InquiryListItem(
            id=UUID("10000000-0000-4000-8000-000000000001"),
            customer_name=None,
            customer_email="customer@example.com",
            subject="문의",
            preview="문의 내용",
            intent="OTHER",
            status="UNKNOWN",
            stage="MANUAL_REQUIRED",
            received_at=datetime(2026, 7, 27, 9, 0, tzinfo=UTC),
        )


def test_status_enum_contains_only_public_inquiry_statuses() -> None:
    assert [status.value for status in InquiryStatus] == [
        "IN_PROGRESS",
        "ACTION_REQUIRED",
        "COMPLETED",
    ]
