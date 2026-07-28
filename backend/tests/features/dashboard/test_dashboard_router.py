from datetime import date

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.features.dashboard.models import DashboardSummaryResponse
from app.features.dashboard.router import provide_dashboard_repository
from app.main import create_app


class FakeDashboardRepository:
    def __init__(self, error: Exception | None = None) -> None:
        self.error = error
        self.received_arguments: dict[str, date] | None = None

    def get_summary(
        self,
        *,
        from_date: date,
        to_date: date,
    ) -> DashboardSummaryResponse:
        self.received_arguments = {
            "from_date": from_date,
            "to_date": to_date,
        }
        if self.error is not None:
            raise self.error

        return DashboardSummaryResponse.model_validate(
            {
                "period": {
                    "from": from_date,
                    "to": to_date,
                    "timezone": "Asia/Seoul",
                },
                "summary": {
                    "total_inquiries": 6,
                    "auto_sent": 1,
                    "action_required": 4,
                    "failed": 1,
                },
                "status_distribution": [],
                "intent_distribution": [],
                "completion_distribution": [],
                "daily_trend": [],
            }
        )


def test_get_dashboard_summary_uses_explicit_period() -> None:
    repository = FakeDashboardRepository()
    application = create_app(Settings())
    application.dependency_overrides[provide_dashboard_repository] = lambda: repository

    response = TestClient(application).get(
        "/dashboard/summary",
        params={"from": "2026-07-22", "to": "2026-07-28"},
    )

    assert response.status_code == 200
    assert response.json()["summary"]["failed"] == 1
    assert response.json()["period"]["from"] == "2026-07-22"
    assert repository.received_arguments == {
        "from_date": date(2026, 7, 22),
        "to_date": date(2026, 7, 28),
    }


def test_get_dashboard_summary_defaults_to_seven_days(
    monkeypatch,
) -> None:
    repository = FakeDashboardRepository()
    application = create_app(Settings())
    application.dependency_overrides[provide_dashboard_repository] = lambda: repository
    monkeypatch.setattr(
        "app.features.dashboard.router._today_in_seoul",
        lambda: date(2026, 7, 28),
    )

    response = TestClient(application).get("/dashboard/summary")

    assert response.status_code == 200
    assert repository.received_arguments == {
        "from_date": date(2026, 7, 22),
        "to_date": date(2026, 7, 28),
    }


def test_get_dashboard_summary_rejects_partial_period() -> None:
    application = create_app(Settings())
    application.dependency_overrides[provide_dashboard_repository] = (
        lambda: FakeDashboardRepository()
    )

    response = TestClient(application).get(
        "/dashboard/summary",
        params={"from": "2026-07-22"},
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "from and to must be provided together"


def test_get_dashboard_summary_rejects_reversed_period() -> None:
    application = create_app(Settings())
    application.dependency_overrides[provide_dashboard_repository] = (
        lambda: FakeDashboardRepository()
    )

    response = TestClient(application).get(
        "/dashboard/summary",
        params={"from": "2026-07-28", "to": "2026-07-22"},
    )

    assert response.status_code == 422
    assert response.json()["detail"] == "from must be on or before to"


def test_get_dashboard_summary_hides_database_error_details() -> None:
    application = create_app(Settings())
    application.dependency_overrides[provide_dashboard_repository] = (
        lambda: FakeDashboardRepository(RuntimeError("service-role-secret"))
    )

    response = TestClient(application).get("/dashboard/summary")

    assert response.status_code == 503
    assert response.json() == {"detail": "dashboard unavailable"}
    assert "service-role-secret" not in response.text
