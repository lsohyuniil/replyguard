import type {
  AttentionInquiry,
  DashboardTone,
  DistributionItem,
} from "@/lib/dashboard/types";
import { mapInquiryListItem } from "@/lib/inquiries/mapper";
import type { InquirySource } from "@/lib/inquiries";

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

export function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function mapDistribution<T extends { count: number; label: string }>(
  items: T[],
  keyFor: (item: T) => string,
): DistributionItem[] {
  return items.map((item, index) => ({
    key: keyFor(item),
    label: item.label,
    count: item.count,
    tone: distributionTones[index % distributionTones.length],
  }));
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
