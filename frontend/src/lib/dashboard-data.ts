import dashboardFixture from "../../../data/seeds/dashboard.json";
import inquiryFixture from "../../../data/seeds/inquiries.json";

export type TrendPoint = (typeof dashboardFixture.daily_trend)[number];

export type DistributionItem = {
  key: string;
  label: string;
  count: number;
  tone: "accent" | "success" | "warning" | "danger" | "muted";
};

export type AttentionInquiry = {
  id: string;
  subject: string;
  customerName: string;
  intentLabel: string;
  stageLabel: string;
  receivedAt: string;
};

type SummaryCardData = {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  helper: string;
  tone: "accent" | "success" | "warning" | "danger" | "muted";
};

const intentLabels: Record<string, string> = {
  DELIVERY_STATUS: "배송 현황",
  POLICY_FAQ: "정책 FAQ",
  EXCHANGE: "교환",
  REFUND: "환불",
  DAMAGE: "파손·오배송",
  COMPENSATION: "보상",
  OTHER: "기타",
};

const stageLabels: Record<string, string> = {
  WAITING_APPROVAL: "답변 승인 대기",
  MANUAL_REQUIRED: "직접 확인 필요",
  FAILED: "처리 실패",
};

const tones: DistributionItem["tone"][] = [
  "accent",
  "success",
  "warning",
  "danger",
  "muted",
];

function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function toDistribution<T extends { count: number }>(
  items: T[],
  keyFor: (item: T) => string,
  labelFor: (item: T) => string,
): DistributionItem[] {
  return items.map((item, index) => ({
    key: keyFor(item),
    label: labelFor(item),
    count: item.count,
    tone: tones[index % tones.length],
  }));
}

export function getDashboardData() {
  const summary = dashboardFixture.summary;
  const comparison = dashboardFixture.comparison;
  const attentionIds = new Set(dashboardFixture.attention_inquiry_ids);

  const summaryCards: SummaryCardData[] = [
    {
      label: "전체 문의",
      value: `${summary.total_inquiries}건`,
      change: formatChange(comparison.total_inquiries_change_percent),
      changeDirection: "up",
      helper: "지난 7일 대비",
      tone: "accent",
    },
    {
      label: "자동 발송",
      value: `${summary.auto_sent}건`,
      change: formatChange(comparison.auto_sent_change_percent),
      changeDirection: "up",
      helper: `자동 처리율 ${summary.automation_rate.toFixed(0)}%`,
      tone: "success",
    },
    {
      label: "확인 필요",
      value: `${summary.action_required}건`,
      change: formatChange(comparison.action_required_change_percent),
      changeDirection: "down",
      helper: "지난 7일 대비",
      tone: "warning",
    },
    {
      label: "처리 실패",
      value: `${summary.failed}건`,
      change: formatChange(comparison.failed_change_percent),
      changeDirection: "down",
      helper: "지난 7일 대비",
      tone: "danger",
    },
  ];

  const attentionInquiries: AttentionInquiry[] = inquiryFixture
    .filter((inquiry) => attentionIds.has(inquiry.id))
    .map((inquiry) => ({
      id: inquiry.id,
      subject: inquiry.subject,
      customerName: inquiry.customer_name,
      intentLabel: intentLabels[inquiry.intent] ?? inquiry.intent,
      stageLabel:
        inquiry.required_action?.label ??
        stageLabels[inquiry.stage] ??
        inquiry.stage,
      receivedAt: new Intl.DateTimeFormat("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: dashboardFixture.period.timezone,
      }).format(new Date(inquiry.received_at)),
    }));

  return {
    periodLabel: `${dashboardFixture.period.from.replaceAll("-", ".")} – ${dashboardFixture.period.to.replaceAll("-", ".")}`,
    summaryCards,
    dailyTrend: dashboardFixture.daily_trend,
    statusDistribution: toDistribution(
      dashboardFixture.status_distribution,
      (item) => item.status,
      (item) => item.label,
    ),
    intentDistribution: toDistribution(
      dashboardFixture.intent_distribution,
      (item) => item.intent,
      (item) => item.label,
    ),
    completionDistribution: toDistribution(
      dashboardFixture.completion_distribution,
      (item) => item.completion_type,
      (item) => item.label,
    ),
    attentionInquiries,
  };
}
