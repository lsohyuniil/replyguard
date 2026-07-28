import pytest
from pydantic import ValidationError

from app.features.dashboard.models import DashboardSummaryResponse


def dashboard_payload() -> dict[str, object]:
    return {
        "period": {
            "from": "2026-07-22",
            "to": "2026-07-28",
            "timezone": "Asia/Seoul",
        },
        "summary": {
            "total_inquiries": 6,
            "auto_sent": 1,
            "action_required": 4,
            "failed": 1,
        },
        "status_distribution": [
            {"status": "IN_PROGRESS", "count": 1},
            {"status": "ACTION_REQUIRED", "count": 4},
            {"status": "COMPLETED", "count": 1},
        ],
        "intent_distribution": [
            {"intent": "DELIVERY_STATUS", "count": 1},
        ],
        "completion_distribution": [
            {"completion_type": "AUTO_SENT", "count": 1},
        ],
        "daily_trend": [
            {
                "date": "2026-07-28",
                "total": 1,
                "in_progress": 0,
                "action_required": 0,
                "completed": 1,
                "auto_sent": 1,
            }
        ],
    }


def test_dashboard_summary_response_validates_complete_payload() -> None:
    response = DashboardSummaryResponse.model_validate(dashboard_payload())

    assert response.summary.failed == 1
    assert response.period.from_.isoformat() == "2026-07-22"
    assert response.period.timezone == "Asia/Seoul"


@pytest.mark.parametrize(
    ("path", "value"),
    [
        (("summary", "failed"), -1),
        (("daily_trend", 0, "total"), -1),
    ],
)
def test_dashboard_summary_response_rejects_negative_counts(
    path: tuple[str | int, ...],
    value: int,
) -> None:
    payload = dashboard_payload()
    target: object = payload
    for key in path[:-1]:
        target = target[key]  # type: ignore[index]
    target[path[-1]] = value  # type: ignore[index]

    with pytest.raises(ValidationError):
        DashboardSummaryResponse.model_validate(payload)


def test_dashboard_summary_response_rejects_unknown_completion_type() -> None:
    payload = dashboard_payload()
    payload["completion_distribution"][0]["completion_type"] = "UNKNOWN"  # type: ignore[index]

    with pytest.raises(ValidationError):
        DashboardSummaryResponse.model_validate(payload)
