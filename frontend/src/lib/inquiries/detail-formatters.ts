import type {
  ApiInquiryIntent,
  ApiInquiryStatus,
  InquiryStage,
} from "@/lib/inquiries/types";

export const detailIntentLabels: Record<ApiInquiryIntent, string> = {
  DELIVERY_STATUS: "배송 현황",
  POLICY_FAQ: "정책 FAQ",
  EXCHANGE: "교환",
  REFUND: "환불",
  DAMAGE: "파손·오배송",
  COMPENSATION: "보상",
  OTHER: "기타",
};

export const detailStatusLabels: Record<ApiInquiryStatus, string> = {
  IN_PROGRESS: "처리 중",
  ACTION_REQUIRED: "확인 필요",
  COMPLETED: "처리 완료",
};

export const detailStageLabels: Record<InquiryStage, string> = {
  ANALYZING: "AI 분석 중",
  WAITING_CUSTOMER: "고객 회신 대기",
  SENDING: "이메일 발송 중",
  WAITING_APPROVAL: "답변 승인 대기",
  MANUAL_REQUIRED: "직접 확인 필요",
  FAILED: "처리 실패",
  DONE: "처리 완료",
};

export function formatDetailDateTime(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCollectedValue(value: unknown) {
  if (typeof value === "boolean") return value ? "예" : "아니요";
  if (Array.isArray(value)) return value.join(", ");
  if (value && typeof value === "object") return JSON.stringify(value);
  return String(value);
}
