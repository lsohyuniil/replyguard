from datetime import UTC, datetime
from uuid import UUID

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.features.inquiries.models import (
    InquiryListItem,
    InquiryListResponse,
    InquiryStatusCounts,
)
from app.features.inquiries.router import provide_inquiry_repository
from app.main import create_app


class FakeInquiryRepository:
    def __init__(self, error: Exception | None = None) -> None:
        self.error = error
        self.received_arguments: dict[str, object] | None = None

    def list_inquiries(self, **kwargs: object) -> InquiryListResponse:
        self.received_arguments = kwargs
        if self.error is not None:
            raise self.error

        return InquiryListResponse(
            items=[
                InquiryListItem(
                    id=UUID("10000000-0000-4000-8000-000000000003"),
                    customer_name="박교환",
                    customer_email="exchange@example.com",
                    subject="교환 문의",
                    preview="사이즈 교환을 원합니다.",
                    intent="EXCHANGE",
                    status="ACTION_REQUIRED",
                    stage="WAITING_APPROVAL",
                    received_at=datetime(2026, 7, 27, 11, 0, tzinfo=UTC),
                )
            ],
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


def test_get_inquiries_returns_filtered_paginated_response() -> None:
    repository = FakeInquiryRepository()
    application = create_app(Settings())
    application.dependency_overrides[provide_inquiry_repository] = lambda: repository

    response = TestClient(application).get(
        "/inquiries",
        params={
            "search": "교환",
            "status": "ACTION_REQUIRED",
            "intent": "EXCHANGE",
            "page": 2,
            "page_size": 2,
        },
    )

    assert response.status_code == 200
    assert response.json()["total_pages"] == 3
    assert response.json()["items"][0]["customer_email"] == "exchange@example.com"
    assert repository.received_arguments == {
        "search": "교환",
        "status": "ACTION_REQUIRED",
        "intent": "EXCHANGE",
        "page": 2,
        "page_size": 2,
    }


def test_get_inquiries_rejects_invalid_page_size() -> None:
    application = create_app(Settings())
    application.dependency_overrides[provide_inquiry_repository] = (
        lambda: FakeInquiryRepository()
    )

    response = TestClient(application).get("/inquiries?page_size=101")

    assert response.status_code == 422


def test_get_inquiries_hides_database_error_details() -> None:
    application = create_app(Settings())
    application.dependency_overrides[provide_inquiry_repository] = (
        lambda: FakeInquiryRepository(RuntimeError("service-role-secret"))
    )

    response = TestClient(application).get("/inquiries")

    assert response.status_code == 503
    assert response.json() == {"detail": "inquiries unavailable"}
    assert "service-role-secret" not in response.text
