"use client";

import { useMemo } from "react";
import { InquiryEmptyState } from "@/components/inquiries/inbox/inquiry-empty-state";
import { InquiryIntentFilter } from "@/components/inquiries/inbox/inquiry-intent-filter";
import { InquirySearch } from "@/components/inquiries/inbox/inquiry-search";
import { InquiryStatusFilter } from "@/components/inquiries/inbox/inquiry-status-filter";
import { InquiryList } from "@/components/inquiries/list/inquiry-list";
import { useInquiryFilters } from "@/hooks/inquiries/use-inquiry-filters";
import { useInquiriesQuery } from "@/hooks/inquiries/use-inquiries-query";
import {
  inquiryIntentOptions,
  inquiryReceivedAtFormatter,
  mapInquiryListItem,
  type InquiryStatus,
} from "@/lib/inquiries";

type InquiryInboxProps = {
  initialStatus: InquiryStatus;
};

export function InquiryInbox({
  initialStatus,
}: InquiryInboxProps) {
  const filters = useInquiryFilters(initialStatus);
  const inquiryQuery = useInquiriesQuery(filters.queryParams);
  const inquiries = useMemo(
    () =>
      (inquiryQuery.data?.items ?? []).map((inquiry) =>
        mapInquiryListItem(inquiry, inquiryReceivedAtFormatter),
      ),
    [inquiryQuery.data?.items],
  );
  const statusCounts = inquiryQuery.data?.status_counts ?? {
    ALL: 0,
    IN_PROGRESS: 0,
    ACTION_REQUIRED: 0,
    COMPLETED: 0,
  };

  return (
    <div className="space-y-5">
      <InquiryStatusFilter
        value={filters.status}
        counts={statusCounts}
        onChange={filters.setStatus}
      />

      <section
        className="overflow-hidden rounded-2xl border border-border bg-surface"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:p-5">
          <InquirySearch value={filters.search} onChange={filters.setSearch} />
          <InquiryIntentFilter
            value={filters.intent}
            options={inquiryIntentOptions}
            onChange={filters.setIntent}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 text-sm">
          <p className="text-muted-foreground">
            총
            <strong className="text-foreground">
              {inquiryQuery.data?.total_count ?? 0}
            </strong>
            건
          </p>
          {(inquiryQuery.isFetching || filters.isSearchPending) && (
            <span className="text-xs font-medium text-muted-foreground">
              목록 갱신 중
            </span>
          )}
          {filters.hasActiveFilters && (
            <button
              type="button"
              onClick={filters.resetFilters}
              className="font-semibold text-accent hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>

        {inquiryQuery.isPending ? (
          <div
            role="status"
            className="px-6 py-16 text-center text-sm text-muted-foreground"
          >
            문의를 불러오는 중입니다.
          </div>
        ) : inquiryQuery.isError ? (
          <div role="alert" className="px-6 py-16 text-center">
            <p className="font-semibold text-foreground">
              문의를 불러오지 못했습니다.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              백엔드 연결을 확인한 뒤 다시 시도해 주세요.
            </p>
            <button
              type="button"
              onClick={() => inquiryQuery.refetch()}
              className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              다시 시도
            </button>
          </div>
        ) : inquiries.length === 0 ? (
          <InquiryEmptyState onReset={filters.resetFilters} />
        ) : (
          <InquiryList
            inquiries={inquiries}
            currentPage={filters.currentPage}
            totalPages={inquiryQuery.data?.total_pages ?? 0}
            onPageChange={filters.setCurrentPage}
          />
        )}
      </section>
    </div>
  );
}
