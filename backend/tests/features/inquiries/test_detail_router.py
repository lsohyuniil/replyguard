from uuid import UUID

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.features.inquiries.detail_models import InquiryDetailResponse
from app.features.inquiries.detail_repository import InquiryNotFoundError
from app.features.inquiries.router import provide_inquiry_detail_repository
from app.main import create_app


class FakeInquiryDetailRepository:
    def __init__(self, error: Exception | None = None) -> None:
        self.error = error
        self.received_id: UUID | None = None

    def get_detail(self, inquiry_id: UUID) -> InquiryDetailResponse:
        self.received_id = inquiry_id
        if self.error is not None:
            raise self.error

        return InquiryDetailResponse.model_validate(
            {
                "id": inquiry_id,
                "gmail_thread_id": "thread_exchange_resumed",
                "customer_name": "최유나",
                "customer_email": "yuna.choi@example.com",
                "subject": "셔츠를 다른 사이즈로 교환하고 싶습니다",
                "preview": "M 사이즈로 교환하고 싶습니다.",
                "intent": "EXCHANGE",
                "status": "ACTION_REQUIRED",
                "stage": "WAITING_APPROVAL",
                "completion_type": None,
                "collected_information": {"desired_size": "M"},
                "required_action": {
                    "type": "REVIEW_DRAFT",
                    "label": "교환 답변 검토",
                },
                "received_at": "2026-07-16T02:10:00Z",
                "updated_at": "2026-07-16T03:02:12Z",
                "messages": [],
                "order": None,
                "order_candidates": [],
                "policies": [],
                "agent_run": None,
                "answer_draft": None,
            }
        )


def test_get_inquiry_detail_returns_related_data() -> None:
    inquiry_id = UUID("30000000-0000-4000-8000-000000000003")
    repository = FakeInquiryDetailRepository()
    application = create_app(Settings())
    application.dependency_overrides[provide_inquiry_detail_repository] = (
        lambda: repository
    )

    response = TestClient(application).get(f"/inquiries/{inquiry_id}")

    assert response.status_code == 200
    assert response.json()["id"] == str(inquiry_id)
    assert response.json()["collected_information"] == {"desired_size": "M"}
    assert repository.received_id == inquiry_id


def test_get_inquiry_detail_returns_404_when_missing() -> None:
    inquiry_id = UUID("30000000-0000-4000-8000-000000000099")
    application = create_app(Settings())
    application.dependency_overrides[provide_inquiry_detail_repository] = (
        lambda: FakeInquiryDetailRepository(InquiryNotFoundError())
    )

    response = TestClient(application).get(f"/inquiries/{inquiry_id}")

    assert response.status_code == 404
    assert response.json() == {"detail": "inquiry not found"}


def test_get_inquiry_detail_hides_database_error_details() -> None:
    inquiry_id = UUID("30000000-0000-4000-8000-000000000003")
    application = create_app(Settings())
    application.dependency_overrides[provide_inquiry_detail_repository] = (
        lambda: FakeInquiryDetailRepository(RuntimeError("service-role-secret"))
    )

    response = TestClient(application).get(f"/inquiries/{inquiry_id}")

    assert response.status_code == 503
    assert response.json() == {"detail": "inquiry detail unavailable"}
    assert "service-role-secret" not in response.text
