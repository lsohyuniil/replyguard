export {
  intentLabels,
  inquiryIntentOptions,
  inquiryStatusOptions,
} from "@/lib/inquiries/constants";
export { inquiryReceivedAtFormatter } from "@/lib/inquiries/formatters";
export { mapInquiryListItem } from "@/lib/inquiries/mapper";
export type {
  InquiryDetailResponse,
  InquiryMessage,
  InquiryOrder,
  InquiryPolicy,
} from "@/lib/inquiries/detail-types";
export type {
  ApiInquiryIntent,
  ApiInquiryStatus,
  InquiryBadgeTone,
  InquiryIntent,
  InquiryListItem,
  InquiryListParams,
  InquiryListResponse,
  InquiryOption,
  InquirySource,
  InquiryStage,
  InquiryStatus,
} from "@/lib/inquiries/types";

import { inquiryStatusOptions } from "@/lib/inquiries/constants";
import type { InquiryStatus } from "@/lib/inquiries/types";

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return inquiryStatusOptions.some((option) => option.value === value);
}
