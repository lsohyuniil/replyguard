from datetime import date
from enum import StrEnum
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field

from app.features.inquiries.models import InquiryIntent, InquiryStatus

Count = Annotated[int, Field(ge=0)]


class CompletionType(StrEnum):
    AUTO_SENT = "AUTO_SENT"
    APPROVED_SENT = "APPROVED_SENT"
    MANUAL_SENT = "MANUAL_SENT"


class DashboardPeriod(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    from_: date = Field(alias="from")
    to: date
    timezone: Literal["Asia/Seoul"]


class DashboardSummary(BaseModel):
    total_inquiries: Count
    auto_sent: Count
    action_required: Count
    failed: Count


class StatusDistributionItem(BaseModel):
    status: InquiryStatus
    count: Count


class IntentDistributionItem(BaseModel):
    intent: InquiryIntent
    count: Count


class CompletionDistributionItem(BaseModel):
    completion_type: CompletionType
    count: Count


class DailyTrendItem(BaseModel):
    date: date
    total: Count
    in_progress: Count
    action_required: Count
    completed: Count
    auto_sent: Count


class DashboardSummaryResponse(BaseModel):
    period: DashboardPeriod
    summary: DashboardSummary
    status_distribution: list[StatusDistributionItem]
    intent_distribution: list[IntentDistributionItem]
    completion_distribution: list[CompletionDistributionItem]
    daily_trend: list[DailyTrendItem]
