export type InquiryStatus =
  | "ALL"
  | "IN_PROGRESS"
  | "ACTION_REQUIRED"
  | "COMPLETED";

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

export type InquiryOption = {
  value: string;
  label: string;
};

export type InquirySource = {
  id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  preview: string;
  intent: string;
  status: string;
  received_at: string;
};
