export { inquiryStatusOptions } from "@/lib/inquiries/constants";
export { getInquiryListData } from "@/lib/inquiries/mock-query";
export type {
  InquiryBadgeTone,
  InquiryListItem,
  InquiryOption,
  InquiryStatus,
} from "@/lib/inquiries/types";

import { inquiryStatusOptions } from "@/lib/inquiries/constants";
import type { InquiryStatus } from "@/lib/inquiries/types";

export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return inquiryStatusOptions.some((option) => option.value === value);
}
