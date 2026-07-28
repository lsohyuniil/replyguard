from fastapi import HTTPException, status
from supabase import Client

from app.infrastructure.supabase import get_supabase_client


def provide_supabase_client() -> Client:
    try:
        return get_supabase_client()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database unavailable",
        ) from exc

