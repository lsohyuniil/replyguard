import type {
  ApiInquiryIntent,
  ApiInquiryStatus,
  InquiryStage,
} from "@/lib/inquiries/types";

export type InquiryCompletionType =
  | "AUTO_SENT"
  | "APPROVED_SENT"
  | "MANUAL_SENT";

export type InquiryMessage = {
  id: string;
  direction: "INBOUND" | "OUTBOUND";
  sender_name: string | null;
  sender_email: string;
  body_text: string;
  occurred_at: string;
  attachments: Record<string, unknown>[];
};

export type InquiryOrder = {
  id: string;
  order_number: string;
  customer_email: string;
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  ordered_at: string;
  currency: string;
  total_amount: number;
  items: {
    id: string;
    sku: string;
    name: string;
    quantity: number;
    unit_price: number;
  }[];
  shipment: {
    id: string;
    carrier: string;
    tracking_number: string;
    status: "READY" | "IN_TRANSIT" | "DELIVERED" | "DELAYED" | "LOOKUP_FAILED";
    shipped_at: string | null;
    estimated_delivery_at: string | null;
    delivered_at: string | null;
    latest_event: string | null;
  } | null;
};

export type InquiryPolicy = {
  policy_id: string;
  category: string;
  title: string;
  version_id: string;
  version: number;
  status: "DRAFT" | "PROCESSING" | "ACTIVE" | "FAILED" | "ARCHIVED";
  content: string;
  published_at: string | null;
  chunks: {
    id: string;
    chunk_index: number;
    content: string;
    metadata: Record<string, unknown>;
  }[];
};

export type InquiryDetailResponse = {
  id: string;
  gmail_thread_id: string;
  customer_name: string | null;
  customer_email: string;
  subject: string;
  preview: string;
  intent: ApiInquiryIntent;
  status: ApiInquiryStatus;
  stage: InquiryStage;
  completion_type: InquiryCompletionType | null;
  collected_information: Record<string, unknown>;
  required_action: Record<string, unknown> | null;
  received_at: string;
  updated_at: string;
  messages: InquiryMessage[];
  order: InquiryOrder | null;
  order_candidates: InquiryOrder[];
  policies: InquiryPolicy[];
  agent_run: {
    id: string;
    status: "RUNNING" | "INTERRUPTED" | "COMPLETED" | "FAILED";
    step_count: number;
    resume_count: number;
    error_code: string | null;
    started_at: string;
    resumed_at: string | null;
    finished_at: string | null;
  } | null;
  answer_draft: {
    id: string;
    version: number;
    ai_content: string;
    final_content: string | null;
    evidence: Record<string, unknown>[];
    status:
      | "DRAFT"
      | "WAITING_APPROVAL"
      | "APPROVED"
      | "REJECTED"
      | "SENT"
      | "INVALIDATED";
    created_at: string;
  } | null;
};
