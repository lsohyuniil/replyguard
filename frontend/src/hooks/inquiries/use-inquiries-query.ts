"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInquiryList } from "@/lib/inquiries/api";
import type { InquiryListParams } from "@/lib/inquiries/types";

export function useInquiriesQuery(params: InquiryListParams) {
  return useQuery({
    queryKey: ["inquiries", "list", params],
    queryFn: ({ signal }) => fetchInquiryList(params, signal),
  });
}
