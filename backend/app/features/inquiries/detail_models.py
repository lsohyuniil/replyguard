from datetime import datetime
from enum import StrEnum
from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field

from app.features.inquiries.models import (
    InquiryIntent,
    InquiryStage,
    InquiryStatus,
)


class InquiryCompletionType(StrEnum):
    AUTO_SENT = "AUTO_SENT"
    APPROVED_SENT = "APPROVED_SENT"
    MANUAL_SENT = "MANUAL_SENT"


class MessageDirection(StrEnum):
    INBOUND = "INBOUND"
    OUTBOUND = "OUTBOUND"


class OrderStatus(StrEnum):
    PENDING = "PENDING"
    PAID = "PAID"
    SHIPPED = "SHIPPED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class ShipmentStatus(StrEnum):
    READY = "READY"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    DELAYED = "DELAYED"
    LOOKUP_FAILED = "LOOKUP_FAILED"


class PolicyVersionStatus(StrEnum):
    DRAFT = "DRAFT"
    PROCESSING = "PROCESSING"
    ACTIVE = "ACTIVE"
    FAILED = "FAILED"
    ARCHIVED = "ARCHIVED"


class AgentRunStatus(StrEnum):
    RUNNING = "RUNNING"
    INTERRUPTED = "INTERRUPTED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AnswerDraftStatus(StrEnum):
    DRAFT = "DRAFT"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SENT = "SENT"
    INVALIDATED = "INVALIDATED"


class InquiryMessage(BaseModel):
    id: UUID
    direction: MessageDirection
    sender_name: str | None
    sender_email: str
    body_text: str
    occurred_at: datetime
    attachments: list[dict[str, Any]]


class OrderItem(BaseModel):
    id: UUID
    sku: str
    name: str
    quantity: int = Field(gt=0)
    unit_price: float = Field(ge=0)


class Shipment(BaseModel):
    id: UUID
    carrier: str
    tracking_number: str
    status: ShipmentStatus
    shipped_at: datetime | None
    estimated_delivery_at: datetime | None
    delivered_at: datetime | None
    latest_event: str | None


class InquiryOrder(BaseModel):
    id: UUID
    order_number: str
    customer_email: str
    status: OrderStatus
    ordered_at: datetime
    currency: str
    total_amount: float = Field(ge=0)
    items: list[OrderItem]
    shipment: Shipment | None


class PolicyChunk(BaseModel):
    id: UUID
    chunk_index: int = Field(ge=0)
    content: str
    metadata: dict[str, Any]


class InquiryPolicy(BaseModel):
    policy_id: UUID
    category: str
    title: str
    version_id: UUID
    version: int = Field(gt=0)
    status: PolicyVersionStatus
    content: str
    published_at: datetime | None
    chunks: list[PolicyChunk]


class AgentRunSummary(BaseModel):
    id: UUID
    status: AgentRunStatus
    step_count: int = Field(ge=0, le=12)
    resume_count: int = Field(ge=0)
    error_code: str | None
    started_at: datetime
    resumed_at: datetime | None
    finished_at: datetime | None


class AnswerDraft(BaseModel):
    id: UUID
    version: int = Field(gt=0)
    ai_content: str
    final_content: str | None
    evidence: list[dict[str, Any]]
    status: AnswerDraftStatus
    created_at: datetime


class InquiryDetailResponse(BaseModel):
    id: UUID
    gmail_thread_id: str
    customer_name: str | None
    customer_email: str
    subject: str
    preview: str
    intent: InquiryIntent
    status: InquiryStatus
    stage: InquiryStage
    completion_type: InquiryCompletionType | None
    collected_information: dict[str, Any]
    required_action: dict[str, Any] | None
    received_at: datetime
    updated_at: datetime
    messages: list[InquiryMessage]
    order: InquiryOrder | None
    order_candidates: list[InquiryOrder]
    policies: list[InquiryPolicy]
    agent_run: AgentRunSummary | None
    answer_draft: AnswerDraft | None
