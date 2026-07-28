export type InquiryStatus =
  | "ALL"
  | "IN_PROGRESS"
  | "ACTION_REQUIRED"
  | "COMPLETED";

export type ApiInquiryStatus = Exclude<InquiryStatus, "ALL">;

export type InquiryIntent =
  | "ALL"
  | "DELIVERY_STATUS"
  | "POLICY_FAQ"
  | "EXCHANGE"
  | "REFUND"
  | "DAMAGE"
  | "COMPENSATION"
  | "OTHER";

export type ApiInquiryIntent = Exclude<InquiryIntent, "ALL">;

export type InquiryStage =
  | "ANALYZING"
  | "WAITING_CUSTOMER"
  | "SENDING"
  | "WAITING_APPROVAL"
  | "MANUAL_REQUIRED"
  | "FAILED"
  | "DONE";

export type InquiryBadgeTone = "accent" | "warning" | "success" | "danger";

export type InquiryListItem = {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  preview: string;
  intent: ApiInquiryIntent;
  intentLabel: string;
  status: ApiInquiryStatus;
  statusLabel: string;
  statusTone: InquiryBadgeTone;
  receivedAt: string;
};

export type InquiryListParams = {
  search: string;
  status: InquiryStatus;
  intent: InquiryIntent;
  page: number;
  pageSize: number;
};

export type InquiryOption = {
  value: ApiInquiryIntent;
  label: string;
};

export type InquirySource = {
  id: string;
  customer_name: string | null;
  customer_email: string;
  subject: string;
  preview: string;
  intent: ApiInquiryIntent;
  status: ApiInquiryStatus;
  stage: InquiryStage;
  received_at: string;
};

export type InquiryStatusCounts = Record<InquiryStatus, number>;

export type InquiryListResponse = {
  items: InquirySource[];
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  status_counts: InquiryStatusCounts;
};
