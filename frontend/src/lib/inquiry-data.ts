import inquiryFixture from "../../../data/seeds/inquiries.json";

export type InquiryStatus = "ALL" | "IN_PROGRESS" | "ACTION_REQUIRED" | "COMPLETED";
export type InquiryBadgeTone = "accent" | "warning" | "success" | "danger";

export type InquiryListItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  preview: string;
  intent: string;
  intentLabel: string;
  status: Exclude<InquiryStatus, "ALL">;
  statusLabel: string;
  statusTone: InquiryBadgeTone;
  receivedAt: string;
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

const statusLabels: Record<Exclude<InquiryStatus, "ALL">, string> = {
  IN_PROGRESS: "처리 중",
  ACTION_REQUIRED: "확인 필요",
  COMPLETED: "처리 완료",
};

const statusTones: Record<
  Exclude<InquiryStatus, "ALL">,
  InquiryBadgeTone
> = {
  IN_PROGRESS: "accent",
  ACTION_REQUIRED: "warning",
  COMPLETED: "success",
};

export const inquiryStatusOptions: { value: InquiryStatus; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "ACTION_REQUIRED", label: "확인 필요" },
  { value: "COMPLETED", label: "처리 완료" },
];

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return inquiryStatusOptions.some((option) => option.value === value);
}

export function getInquiryListData() {
  const receivedAtFormatter = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });

  const inquiries: InquiryListItem[] = [...inquiryFixture]
    .sort((a, b) => b.received_at.localeCompare(a.received_at))
    .map((inquiry) => {
      const status = inquiry.status as InquiryListItem["status"];

      return {
        id: inquiry.id,
        customerName: inquiry.customer_name,
        customerEmail: inquiry.customer_email,
        subject: inquiry.subject,
        preview: inquiry.preview,
        intent: inquiry.intent,
        intentLabel: intentLabels[inquiry.intent] ?? inquiry.intent,
        status,
        statusLabel: statusLabels[status],
        statusTone: statusTones[status],
        receivedAt: receivedAtFormatter.format(new Date(inquiry.received_at)),
      };
    });

  const statusCounts = {
    ALL: inquiries.length,
    IN_PROGRESS: inquiries.filter((item) => item.status === "IN_PROGRESS").length,
    ACTION_REQUIRED: inquiries.filter((item) => item.status === "ACTION_REQUIRED").length,
    COMPLETED: inquiries.filter((item) => item.status === "COMPLETED").length,
  };

  const intentOptions = Array.from(
    new Map(
      inquiries.map((item) => [
        item.intent,
        { value: item.intent, label: item.intentLabel },
      ]),
    ).values(),
  );

  return { inquiries, statusCounts, intentOptions };
}
