import { apiFetch } from "@/lib/api/client";
import type {
  InquiryListParams,
  InquiryListResponse,
} from "@/lib/inquiries/types";

export function fetchInquiryList(
  params: InquiryListParams,
  signal?: AbortSignal,
) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    page_size: String(params.pageSize),
  });

  if (params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params.status !== "ALL") {
    searchParams.set("status", params.status);
  }
  if (params.intent !== "ALL") {
    searchParams.set("intent", params.intent);
  }

  return apiFetch<InquiryListResponse>(
    `/inquiries?${searchParams.toString()}`,
    { signal },
  );
}
