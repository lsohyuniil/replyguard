from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import Client

from app.core.config import get_settings
from app.features.auth.models import CurrentOperator
from app.features.auth.repository import OperatorNotLinkedError, OperatorRepository
from app.features.auth.service import (
    AuthProviderUnavailableError,
    InvalidAccessTokenError,
    SupabaseAuthService,
)
from app.infrastructure.supabase import get_supabase_client

bearer_scheme = HTTPBearer(auto_error=False)


def provide_supabase_client() -> Client:
    try:
        return get_supabase_client()
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="database unavailable",
        ) from exc


def provide_current_operator(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    client: Annotated[Client, Depends(provide_supabase_client)],
) -> CurrentOperator:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    settings = get_settings()
    if not settings.supabase_url:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="authentication unavailable",
        )

    try:
        user = SupabaseAuthService(
            client,
            supabase_url=settings.supabase_url,
        ).verify_access_token(credentials.credentials)
        return OperatorRepository(client).get_by_auth_user_id(user.id)
    except InvalidAccessTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except OperatorNotLinkedError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="operator access required",
        ) from exc
    except AuthProviderUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="authentication unavailable",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="authentication unavailable",
        ) from exc
