from dataclasses import dataclass
from datetime import date
from typing import Any
from uuid import UUID

import pytest

from app.features.dashboard.repository import DashboardRepository

OPERATOR_ID = UUID("00000000-0000-4000-8000-000000000001")


@dataclass
class FakeResponse:
    data: dict[str, Any] | None


class FakeRpcQuery:
    def __init__(self, response: FakeResponse) -> None:
        self._response = response

    def execute(self) -> FakeResponse:
        return self._response


class FakeSupabaseClient:
    def __init__(self, response: FakeResponse) -> None:
        self._response = response
        self.rpc_name: str | None = None
        self.rpc_params: dict[str, str] | None = None

    def rpc(self, name: str, params: dict[str, str]) -> FakeRpcQuery:
        self.rpc_name = name
        self.rpc_params = params
        return FakeRpcQuery(self._response)


def dashboard_result() -> dict[str, Any]:
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
            {"intent": "POLICY_FAQ", "count": 0},
            {"intent": "EXCHANGE", "count": 1},
            {"intent": "REFUND", "count": 1},
            {"intent": "DAMAGE", "count": 1},
            {"intent": "COMPENSATION", "count": 0},
            {"intent": "OTHER", "count": 2},
        ],
        "completion_distribution": [
            {"completion_type": "AUTO_SENT", "count": 1},
            {"completion_type": "APPROVED_SENT", "count": 0},
            {"completion_type": "MANUAL_SENT", "count": 0},
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


def test_get_summary_calls_dashboard_rpc_with_iso_dates() -> None:
    client = FakeSupabaseClient(FakeResponse(data=dashboard_result()))

    response = DashboardRepository(client, OPERATOR_ID).get_summary(
        from_date=date(2026, 7, 22),
        to_date=date(2026, 7, 28),
    )

    assert response.summary.total_inquiries == 6
    assert client.rpc_name == "get_dashboard_summary"
    assert client.rpc_params == {
        "p_operator_id": str(OPERATOR_ID),
        "from_date": "2026-07-22",
        "to_date": "2026-07-28",
        "timezone_name": "Asia/Seoul",
    }


def test_get_summary_rejects_empty_rpc_response() -> None:
    client = FakeSupabaseClient(FakeResponse(data=None))

    with pytest.raises(
        RuntimeError,
        match="Dashboard summary query returned no data",
    ):
        DashboardRepository(client, OPERATOR_ID).get_summary(
            from_date=date(2026, 7, 22),
            to_date=date(2026, 7, 28),
        )
