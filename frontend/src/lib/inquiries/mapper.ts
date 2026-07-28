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
    receivedAt: formatter.format(new Date(inquiry.received_at)),
  };
}
