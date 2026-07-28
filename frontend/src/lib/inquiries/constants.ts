import type {
  ApiInquiryIntent,
  InquiryBadgeTone,
  InquiryOption,
  InquiryStatus,
} from "@/lib/inquiries/types";

export const INQUIRY_PAGE_SIZE = 5;

export const intentLabels: Record<ApiInquiryIntent, string> = {
  DELIVERY_STATUS: "배송 현황",
  POLICY_FAQ: "정책 FAQ",
  EXCHANGE: "교환",
  REFUND: "환불",
  DAMAGE: "파손·오배송",
  COMPENSATION: "보상",
  OTHER: "기타",
};

export const statusLabels: Record<
  Exclude<InquiryStatus, "ALL">,
  string
> = {
  IN_PROGRESS: "처리 중",
  ACTION_REQUIRED: "확인 필요",
  COMPLETED: "처리 완료",
};

export const statusTones: Record<
  Exclude<InquiryStatus, "ALL">,
  InquiryBadgeTone
> = {
  IN_PROGRESS: "accent",
  ACTION_REQUIRED: "warning",
  COMPLETED: "success",
};

export const inquiryStatusOptions: {
  value: InquiryStatus;
  label: string;
}[] = [
  { value: "ALL", label: "전체" },
  { value: "IN_PROGRESS", label: "처리 중" },
  { value: "ACTION_REQUIRED", label: "확인 필요" },
  { value: "COMPLETED", label: "처리 완료" },
];

export const inquiryIntentOptions: InquiryOption[] = Object.entries(
  intentLabels,
).map(([value, label]) => ({
  value: value as ApiInquiryIntent,
  label,
}));
