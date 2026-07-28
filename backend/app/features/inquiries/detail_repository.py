from typing import Any
from uuid import UUID

from supabase import Client

from app.features.inquiries.detail_models import InquiryDetailResponse

INQUIRY_DETAIL_COLUMNS = (
    "id,gmail_thread_id,customer_name,customer_email,subject,preview,"
    "intent,status,stage,completion_type,collected_information,"
    "required_action,active_agent_run_id,received_at,updated_at,"
    "order:orders("
    "id,order_number,customer_email,status,ordered_at,currency,total_amount,"
    "order_items(id,sku,name,quantity,unit_price),"
    "shipments("
    "id,carrier,tracking_number,status,shipped_at,estimated_delivery_at,"
    "delivered_at,latest_event"
    ")"
    ")"
)
MESSAGE_COLUMNS = (
    "id,direction,sender_name,sender_email,body_text,occurred_at,attachments"
)
ORDER_RELATION_COLUMNS = (
    "order:orders("
    "id,order_number,customer_email,status,ordered_at,currency,total_amount,"
    "order_items(id,sku,name,quantity,unit_price),"
    "shipments("
    "id,carrier,tracking_number,status,shipped_at,estimated_delivery_at,"
    "delivered_at,latest_event"
    ")"
    ")"
)
POLICY_RELATION_COLUMNS = (
    "policy_version:policy_versions("
    "id,version,status,content,published_at,"
    "policy:policies(id,category,title),"
    "policy_chunks(id,chunk_index,content,metadata)"
    ")"
)
AGENT_RUN_COLUMNS = (
    "id,status,step_count,resume_count,error_code,"
    "started_at,resumed_at,finished_at"
)
ANSWER_DRAFT_COLUMNS = (
    "id,version,ai_content,final_content,evidence,status,created_at"
)


class InquiryNotFoundError(Exception):
    pass


class InquiryDetailRepository:
    def __init__(self, client: Client) -> None:
        self._client = client

    def get_detail(self, inquiry_id: UUID) -> InquiryDetailResponse:
        inquiry = (
            self._client.table("inquiries")
            .select(INQUIRY_DETAIL_COLUMNS)
            .eq("id", str(inquiry_id))
            .maybe_single()
            .execute()
            .data
        )
        if inquiry is None:
            raise InquiryNotFoundError

        messages = (
            self._client.table("inquiry_messages")
            .select(MESSAGE_COLUMNS)
            .eq("inquiry_id", str(inquiry_id))
            .order("occurred_at")
            .execute()
            .data
        )
        candidate_rows = (
            self._client.table("inquiry_order_candidates")
            .select(ORDER_RELATION_COLUMNS)
            .eq("inquiry_id", str(inquiry_id))
            .execute()
            .data
        )
        policy_rows = (
            self._client.table("inquiry_policy_versions")
            .select(POLICY_RELATION_COLUMNS)
            .eq("inquiry_id", str(inquiry_id))
            .execute()
            .data
        )

        agent_run = self._get_agent_run(inquiry.get("active_agent_run_id"))
        answer_drafts = (
            self._client.table("answer_drafts")
            .select(ANSWER_DRAFT_COLUMNS)
            .eq("inquiry_id", str(inquiry_id))
            .order("version", desc=True)
            .limit(1)
            .execute()
            .data
        )

        return InquiryDetailResponse.model_validate(
            {
                **inquiry,
                "messages": messages or [],
                "order": _normalize_order(inquiry.get("order")),
                "order_candidates": [
                    normalized
                    for row in candidate_rows or []
                    if (normalized := _normalize_order(row.get("order"))) is not None
                ],
                "policies": [
                    _normalize_policy(row["policy_version"])
                    for row in policy_rows or []
                    if row.get("policy_version")
                ],
                "agent_run": agent_run,
                "answer_draft": answer_drafts[0] if answer_drafts else None,
            }
        )

    def _get_agent_run(self, agent_run_id: str | None) -> dict[str, Any] | None:
        if agent_run_id is None:
            return None

        return (
            self._client.table("agent_runs")
            .select(AGENT_RUN_COLUMNS)
            .eq("id", agent_run_id)
            .maybe_single()
            .execute()
            .data
        )


def _normalize_order(order: dict[str, Any] | None) -> dict[str, Any] | None:
    if order is None:
        return None

    shipments = order.get("shipments")
    shipment = shipments[0] if isinstance(shipments, list) and shipments else shipments

    return {
        **order,
        "items": order.get("order_items") or [],
        "shipment": shipment,
    }


def _normalize_policy(policy_version: dict[str, Any]) -> dict[str, Any]:
    policy = policy_version["policy"]
    return {
        "policy_id": policy["id"],
        "category": policy["category"],
        "title": policy["title"],
        "version_id": policy_version["id"],
        "version": policy_version["version"],
        "status": policy_version["status"],
        "content": policy_version["content"],
        "published_at": policy_version["published_at"],
        "chunks": policy_version.get("policy_chunks") or [],
    }
