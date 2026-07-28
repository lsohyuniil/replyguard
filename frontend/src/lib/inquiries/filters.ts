import type {
  InquiryListItem,
  InquiryStatus,
} from "@/lib/inquiries/types";

type InquiryFilters = {
  search: string;
  status: InquiryStatus;
  intent: string;
};

export function filterInquiries(
  inquiries: InquiryListItem[],
  filters: InquiryFilters,
) {
  const normalizedSearch = filters.search.trim().toLocaleLowerCase("ko-KR");

  return inquiries.filter((inquiry) => {
    const matchesStatus =
      filters.status === "ALL" || inquiry.status === filters.status;
    const matchesIntent =
      filters.intent === "ALL" || inquiry.intent === filters.intent;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      [
        inquiry.customerName,
        inquiry.customerEmail,
        inquiry.subject,
        inquiry.preview,
      ].some((value) =>
        value.toLocaleLowerCase("ko-KR").includes(normalizedSearch),
      );

    return matchesStatus && matchesIntent && matchesSearch;
  });
}
