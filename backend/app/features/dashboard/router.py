from datetime import date, datetime, timedelta
from typing import Annotated
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from app.api.dependencies import provide_current_operator, provide_supabase_client
from app.features.auth.models import CurrentOperator
from app.features.dashboard.models import DashboardSummaryResponse
from app.features.dashboard.repository import DashboardRepository

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def provide_dashboard_repository(
    client: Annotated[Client, Depends(provide_supabase_client)],
    operator: Annotated[CurrentOperator, Depends(provide_current_operator)],
) -> DashboardRepository:
    return DashboardRepository(client, operator.id)


def _today_in_seoul() -> date:
    return datetime.now(ZoneInfo("Asia/Seoul")).date()


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(
    repository: Annotated[
        DashboardRepository,
        Depends(provide_dashboard_repository),
    ],
    from_date: Annotated[date | None, Query(alias="from")] = None,
    to_date: Annotated[date | None, Query(alias="to")] = None,
) -> DashboardSummaryResponse:
    if (from_date is None) != (to_date is None):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="from and to must be provided together",
        )

    if from_date is None:
        to_date = _today_in_seoul()
        from_date = to_date - timedelta(days=6)

    if to_date is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="from and to must be provided together",
        )

    if from_date > to_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="from must be on or before to",
        )

    try:
        return repository.get_summary(
            from_date=from_date,
            to_date=to_date,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="dashboard unavailable",
        ) from exc
