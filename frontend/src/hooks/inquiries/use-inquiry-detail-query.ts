"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchInquiryDetail } from "@/lib/inquiries/api";

export function useInquiryDetailQuery(inquiryId: string) {
  return useQuery({
    queryKey: ["inquiries", "detail", inquiryId],
    queryFn: ({ signal }) => fetchInquiryDetail(inquiryId, signal),
  });
}
