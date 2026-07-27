import dashboardFixture from "../../../data/seeds/dashboard.json";
import inquiryFixture from "../../../data/seeds/inquiries.json";
import type { InquiryBadgeTone } from "@/lib/inquiry-data";

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
  preview: string;
  customerName: string;
  customerEmail: string;
  intentLabel: string;
  stageLabel: string;
  statusTone: InquiryBadgeTone;
  receivedAt: string;
};

type SummaryCardData = {
  label: string;
  value: string;
  change: string;
  isImprovement: boolean;
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

function toDistribution<T extends { count: number; label: string }>(
  items: T[],
  keyFor: (item: T) => string,
): DistributionItem[] {
  return items.map((item, index) => ({
    key: keyFor(item),
    label: item.label,
    count: item.count,
    tone: tones[index % tones.length],
  }));
}

// JSON 목데이터를 대시보드 컴포넌트에서 쓰기 좋은 형태로 정리함
export function getDashboardData() {
  const summary = dashboardFixture.summary;
  const comparison = dashboardFixture.comparison;
  const attentionIds = new Set(dashboardFixture.attention_inquiry_ids);
  const receivedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: dashboardFixture.period.timezone,
  });

  const summaryCards: SummaryCardData[] = [
    {
      label: "전체 문의",
      value: `${summary.total_inquiries}건`,
      change: formatChange(comparison.total_inquiries_change_percent),
      isImprovement: comparison.total_inquiries_change_percent > 0,
      helper: "지난 7일 대비",
      tone: "accent",
    },
    {
      label: "자동 발송",
      value: `${summary.auto_sent}건`,
      change: formatChange(comparison.auto_sent_change_percent),
      isImprovement: comparison.auto_sent_change_percent > 0,
      helper: `자동 처리율 ${summary.automation_rate.toFixed(0)}%`,
      tone: "success",
    },
    {
      label: "확인 필요",
      value: `${summary.action_required}건`,
      change: formatChange(comparison.action_required_change_percent),
      isImprovement: comparison.action_required_change_percent < 0,
      helper: "지난 7일 대비",
      tone: "warning",
    },
    {
      label: "처리 실패",
      value: `${summary.failed}건`,
      change: formatChange(comparison.failed_change_percent),
      isImprovement: comparison.failed_change_percent < 0,
      helper: "지난 7일 대비",
      tone: "danger",
    },
  ];

  const attentionInquiries: AttentionInquiry[] = inquiryFixture
    .filter((inquiry) => attentionIds.has(inquiry.id))
    .map((inquiry) => ({
      id: inquiry.id,
      subject: inquiry.subject,
      preview: inquiry.preview,
      customerName: inquiry.customer_name,
      customerEmail: inquiry.customer_email,
      intentLabel: intentLabels[inquiry.intent] ?? inquiry.intent,
      stageLabel:
        inquiry.required_action?.label ??
        stageLabels[inquiry.stage] ??
        inquiry.stage,
      statusTone: inquiry.stage === "FAILED" ? "danger" : "warning",
      receivedAt: receivedAtFormatter.format(new Date(inquiry.received_at)),
    }));

  return {
    periodLabel: `${dashboardFixture.period.from.replaceAll("-", ".")} – ${dashboardFixture.period.to.replaceAll("-", ".")}`,
    summaryCards,
    dailyTrend: dashboardFixture.daily_trend,
    statusDistribution: toDistribution(
      dashboardFixture.status_distribution,
      (item) => item.status,
    ),
    intentDistribution: toDistribution(
      dashboardFixture.intent_distribution,
      (item) => item.intent,
    ),
    completionDistribution: toDistribution(
      dashboardFixture.completion_distribution,
      (item) => item.completion_type,
    ),
    attentionInquiries,
  };
}
