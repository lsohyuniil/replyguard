import type { InquiryBadgeTone } from "@/lib/inquiries";

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
  change: string;
  isImprovement: boolean;
  helper: string;
  tone: DashboardTone;
};
