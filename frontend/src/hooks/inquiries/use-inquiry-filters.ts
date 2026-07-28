"use client";

import { useMemo, useState } from "react";
import { INQUIRY_PAGE_SIZE } from "@/lib/inquiries/constants";
import { filterInquiries } from "@/lib/inquiries/filters";
import type {
  InquiryListItem,
  InquiryStatus,
} from "@/lib/inquiries/types";

export function useInquiryFilters(
  inquiries: InquiryListItem[],
  initialStatus: InquiryStatus,
) {
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState<InquiryStatus>(initialStatus);
  const [intent, setIntentValue] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInquiries = useMemo(
    () => filterInquiries(inquiries, { search, status, intent }),
    [inquiries, intent, search, status],
  );

  const totalPages = Math.ceil(
    filteredInquiries.length / INQUIRY_PAGE_SIZE,
  );
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * INQUIRY_PAGE_SIZE,
    currentPage * INQUIRY_PAGE_SIZE,
  );

  const resetPage = () => setCurrentPage(1);
  const setSearch = (value: string) => {
    setSearchValue(value);
    resetPage();
  };
  const setStatus = (value: InquiryStatus) => {
    setStatusValue(value);
    resetPage();
  };
  const setIntent = (value: string) => {
    setIntentValue(value);
    resetPage();
  };
  const resetFilters = () => {
    setSearchValue("");
    setStatusValue("ALL");
    setIntentValue("ALL");
    resetPage();
  };

  return {
    search,
    status,
    intent,
    currentPage,
    filteredInquiries,
    paginatedInquiries,
    totalPages,
    hasActiveFilters:
      search.length > 0 || status !== "ALL" || intent !== "ALL",
    setSearch,
    setStatus,
    setIntent,
    setCurrentPage,
    resetFilters,
  };
}
