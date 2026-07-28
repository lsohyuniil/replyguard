from typing import Any

from supabase import Client

from app.features.inquiries.models import (
    InquiryIntent,
    InquiryListResponse,
    InquiryStatus,
    InquiryStatusCounts,
)

INQUIRY_LIST_COLUMNS = (
    "id,customer_name,customer_email,subject,preview,"
    "intent,status,stage,received_at"
)
SEARCH_COLUMNS = ("customer_name", "customer_email", "subject", "preview")


def _escape_search_pattern(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("%", "\\%")
        .replace("_", "\\_")
        .replace(",", "\\,")
    )


def _build_search_filter(search: str) -> str:
    pattern = f"%{_escape_search_pattern(search)}%"
    return ",".join(f'{column}.ilike."{pattern}"' for column in SEARCH_COLUMNS)


class InquiryRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def list_inquiries(
        self,
        *,
        search: str | None = None,
        status: InquiryStatus | None = None,
        intent: InquiryIntent | None = None,
        page: int,
        page_size: int,
    ) -> InquiryListResponse:
        query = self._client.table("inquiries").select(
            INQUIRY_LIST_COLUMNS,
            count="exact",
        )

        if status is not None:
            query = query.eq("status", status.value)
        if intent is not None:
            query = query.eq("intent", intent.value)
        if search:
            query = query.or_(_build_search_filter(search))

        start = (page - 1) * page_size
        result = query.order("received_at", desc=True).range(
            start,
            start + page_size - 1,
        ).execute()

        return InquiryListResponse(
            items=result.data,
            page=page,
            page_size=page_size,
            total_count=result.count if result.count is not None else 0,
            status_counts=self._get_status_counts(),
        )

    def _get_status_counts(self) -> InquiryStatusCounts:
        result = self._client.rpc("get_inquiry_status_counts").execute()
        if not result.data:
            raise RuntimeError("Inquiry status counts query returned no rows")

        return InquiryStatusCounts.model_validate(_normalize_status_counts(result.data[0]))


def _normalize_status_counts(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "ALL": row["all_count"],
        "IN_PROGRESS": row["in_progress_count"],
        "ACTION_REQUIRED": row["action_required_count"],
        "COMPLETED": row["completed_count"],
    }
