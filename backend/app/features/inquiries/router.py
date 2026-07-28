from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase import Client

from app.api.dependencies import provide_supabase_client
from app.features.inquiries.models import (
    InquiryIntent,
    InquiryListResponse,
    InquiryStatus,
)
from app.features.inquiries.repository import InquiryRepository

router = APIRouter(prefix="/inquiries", tags=["inquiries"])


def provide_inquiry_repository(
    client: Annotated[Client, Depends(provide_supabase_client)],
) -> InquiryRepository:
    return InquiryRepository(client)


@router.get("", response_model=InquiryListResponse)
def get_inquiries(
    repository: Annotated[InquiryRepository, Depends(provide_inquiry_repository)],
    search: Annotated[str | None, Query(max_length=100)] = None,
    status_filter: Annotated[InquiryStatus | None, Query(alias="status")] = None,
    intent: InquiryIntent | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 5,
) -> InquiryListResponse:
    normalized_search = search.strip() if search else None

    try:
        return repository.list_inquiries(
            search=normalized_search or None,
            status=status_filter,
            intent=intent,
            page=page,
            page_size=page_size,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="inquiries unavailable",
        ) from exc
