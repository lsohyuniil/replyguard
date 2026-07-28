from datetime import datetime
from enum import StrEnum
from math import ceil
from uuid import UUID

from pydantic import BaseModel, computed_field


class InquiryIntent(StrEnum):
    DELIVERY_STATUS = "DELIVERY_STATUS"
    POLICY_FAQ = "POLICY_FAQ"
    EXCHANGE = "EXCHANGE"
    REFUND = "REFUND"
    DAMAGE = "DAMAGE"
    COMPENSATION = "COMPENSATION"
    OTHER = "OTHER"


class InquiryStatus(StrEnum):
    IN_PROGRESS = "IN_PROGRESS"
    ACTION_REQUIRED = "ACTION_REQUIRED"
    COMPLETED = "COMPLETED"


class InquiryStage(StrEnum):
    ANALYZING = "ANALYZING"
    WAITING_CUSTOMER = "WAITING_CUSTOMER"
    SENDING = "SENDING"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    MANUAL_REQUIRED = "MANUAL_REQUIRED"
    FAILED = "FAILED"
    DONE = "DONE"


class InquiryListItem(BaseModel):
    id: UUID
    customer_name: str | None
    customer_email: str
    subject: str
    preview: str
    intent: InquiryIntent
    status: InquiryStatus
    stage: InquiryStage
    received_at: datetime


class InquiryStatusCounts(BaseModel):
    ALL: int
    IN_PROGRESS: int
    ACTION_REQUIRED: int
    COMPLETED: int


class InquiryListResponse(BaseModel):
    items: list[InquiryListItem]
    page: int
    page_size: int
    total_count: int
    status_counts: InquiryStatusCounts

    @computed_field
    @property
    def total_pages(self) -> int:
        return ceil(self.total_count / self.page_size) if self.total_count else 0
