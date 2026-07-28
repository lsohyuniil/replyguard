from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.api.dependencies import provide_supabase_client
from app.infrastructure.supabase import check_database_connection

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/database")
def database_health(
    client: Annotated[Client, Depends(provide_supabase_client)],
) -> dict[str, str]:
    try:
        check_database_connection(client)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database unavailable",
        ) from exc

    return {"status": "ok"}
