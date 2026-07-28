"use client";

import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/hooks/common/use-debounced-value";
import { INQUIRY_PAGE_SIZE } from "@/lib/inquiries/constants";
import type {
  InquiryIntent,
  InquiryStatus,
} from "@/lib/inquiries/types";

export function useInquiryFilters(
  initialStatus: InquiryStatus,
) {
  const [search, setSearchValue] = useState("");
  const [status, setStatusValue] = useState<InquiryStatus>(initialStatus);
  const [intent, setIntentValue] = useState<InquiryIntent>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 300);
  const queryParams = useMemo(
    () => ({
      search: debouncedSearch,
      status,
      intent,
      page: currentPage,
      pageSize: INQUIRY_PAGE_SIZE,
    }),
    [currentPage, debouncedSearch, intent, status],
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
  const setIntent = (value: InquiryIntent) => {
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
    queryParams,
    isSearchPending: search !== debouncedSearch,
    hasActiveFilters:
      search.length > 0 || status !== "ALL" || intent !== "ALL",
    setSearch,
    setStatus,
    setIntent,
    setCurrentPage,
    resetFilters,
  };
}
