import type {
  AttentionInquiry,
  DashboardData,
  DashboardSummaryResponse,
  DashboardTone,
  DistributionItem,
} from "@/lib/dashboard/types";
import { mapInquiryListItem } from "@/lib/inquiries/mapper";
import {
  intentLabels,
  type InquirySource,
} from "@/lib/inquiries";

const distributionTones: DashboardTone[] = [
  "accent",
  "success",
  "warning",
  "danger",
  "muted",
];

const stageLabels: Record<string, string> = {
  WAITING_APPROVAL: "답변 승인 대기",
  MANUAL_REQUIRED: "직접 확인 필요",
  FAILED: "처리 실패",
};

const statusLabels = {
  IN_PROGRESS: "처리 중",
  ACTION_REQUIRED: "확인 필요",
  COMPLETED: "처리 완료",
};

const completionLabels = {
  AUTO_SENT: "자동 발송",
  APPROVED_SENT: "승인 후 발송",
  MANUAL_SENT: "직접 발송",
};

function mapDistribution<T extends { count: number }>(
  items: T[],
  keyFor: (item: T) => string,
  labelFor: (item: T) => string,
): DistributionItem[] {
  return items.map((item, index) => ({
    key: keyFor(item),
    label: labelFor(item),
    count: item.count,
    tone: distributionTones[index % distributionTones.length],
  }));
}

export function mapDashboardData(
  response: DashboardSummaryResponse,
): DashboardData {
  const { summary } = response;
  const automationRate =
    summary.total_inquiries === 0
      ? 0
      : Math.round((summary.auto_sent / summary.total_inquiries) * 100);

  return {
    periodLabel: `${formatPeriodDate(response.period.from)} – ${formatPeriodDate(response.period.to)}`,
    summaryCards: [
      {
        label: "전체 문의",
        value: `${summary.total_inquiries}건`,
        helper: "최근 7일",
        tone: "accent",
      },
      {
        label: "자동 발송",
        value: `${summary.auto_sent}건`,
        helper: `자동 처리율 ${automationRate}%`,
        tone: "success",
      },
      {
        label: "확인 필요",
        value: `${summary.action_required}건`,
        helper: "현재 확인 필요",
        tone: "warning",
      },
      {
        label: "처리 실패",
        value: `${summary.failed}건`,
        helper: "현재 처리 실패",
        tone: "danger",
      },
    ],
    dailyTrend: response.daily_trend.map(({ date, total }) => ({
      date,
      total,
    })),
    statusDistribution: mapDistribution(
      response.status_distribution,
      (item) => item.status,
      (item) => statusLabels[item.status],
    ),
    intentDistribution: mapDistribution(
      response.intent_distribution,
      (item) => item.intent,
      (item) => intentLabels[item.intent],
    ),
    completionDistribution: mapDistribution(
      response.completion_distribution,
      (item) => item.completion_type,
      (item) => completionLabels[item.completion_type],
    ),
  };
}

function formatPeriodDate(value: string) {
  return value.replaceAll("-", ".");
}

export function mapAttentionInquiry(
  inquiry: InquirySource,
  formatter: Intl.DateTimeFormat,
): AttentionInquiry {
  const listItem = mapInquiryListItem(inquiry, formatter);

  return {
    id: listItem.id,
    subject: listItem.subject,
    preview: listItem.preview,
    customerName: listItem.customerName,
    customerEmail: listItem.customerEmail,
    intentLabel: listItem.intentLabel,
    stageLabel: stageLabels[inquiry.stage] ?? inquiry.stage,
    statusTone: inquiry.stage === "FAILED" ? "danger" : "warning",
    receivedAt: listItem.receivedAt,
  };
}
