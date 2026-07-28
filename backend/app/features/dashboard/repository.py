from datetime import date

from supabase import Client

from app.features.dashboard.models import DashboardSummaryResponse


class DashboardRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def get_summary(
        self,
        *,
        from_date: date,
        to_date: date,
    ) -> DashboardSummaryResponse:
        result = self._client.rpc(
            "get_dashboard_summary",
            {
                "from_date": from_date.isoformat(),
                "to_date": to_date.isoformat(),
                "timezone_name": "Asia/Seoul",
            },
        ).execute()

        if not result.data:
            raise RuntimeError("Dashboard summary query returned no data")

        return DashboardSummaryResponse.model_validate(result.data)
