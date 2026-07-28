import {
  intentLabels,
  statusLabels,
  statusTones,
} from "@/lib/inquiries/constants";
import type {
  InquiryListItem,
  InquirySource,
} from "@/lib/inquiries/types";

export function mapInquiryListItem(
  inquiry: InquirySource,
  formatter: Intl.DateTimeFormat,
): InquiryListItem {
  return {
    id: inquiry.id,
    customerName: inquiry.customer_name ?? inquiry.customer_email,
    customerEmail: inquiry.customer_email,
    subject: inquiry.subject,
    preview: inquiry.preview,
    intent: inquiry.intent,
    intentLabel: intentLabels[inquiry.intent] ?? inquiry.intent,
    status: inquiry.status,
    statusLabel: statusLabels[inquiry.status],
    statusTone: statusTones[inquiry.status],
    receivedAt: formatter.format(new Date(inquiry.received_at)),
  };
}
