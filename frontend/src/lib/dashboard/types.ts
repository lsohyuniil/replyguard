import type {
  ApiInquiryIntent,
  ApiInquiryStatus,
  InquiryBadgeTone,
} from "@/lib/inquiries";

export type DashboardTone =
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "muted";

export type TrendPoint = {
  date: string;
  total: number;
};

export type DistributionItem = {
  key: string;
  label: string;
  count: number;
  tone: DashboardTone;
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

export type SummaryCardData = {
  label: string;
  value: string;
  helper: string;
  tone: DashboardTone;
};

export type CompletionType =
  | "AUTO_SENT"
  | "APPROVED_SENT"
  | "MANUAL_SENT";

export type DashboardSummaryResponse = {
  period: {
    from: string;
    to: string;
    timezone: "Asia/Seoul";
  };
  summary: {
    total_inquiries: number;
    auto_sent: number;
    action_required: number;
    failed: number;
  };
  status_distribution: {
    status: ApiInquiryStatus;
    count: number;
  }[];
  intent_distribution: {
    intent: ApiInquiryIntent;
    count: number;
  }[];
  completion_distribution: {
    completion_type: CompletionType;
    count: number;
  }[];
  daily_trend: {
    date: string;
    total: number;
    in_progress: number;
    action_required: number;
    completed: number;
    auto_sent: number;
  }[];
};

export type DashboardData = {
  periodLabel: string;
  summaryCards: SummaryCardData[];
  dailyTrend: TrendPoint[];
  statusDistribution: DistributionItem[];
  intentDistribution: DistributionItem[];
  completionDistribution: DistributionItem[];
};
