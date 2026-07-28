"use client";

import { InquiryEmptyState } from "@/components/inquiries/inbox/inquiry-empty-state";
import { InquiryIntentFilter } from "@/components/inquiries/inbox/inquiry-intent-filter";
import { InquirySearch } from "@/components/inquiries/inbox/inquiry-search";
import { InquiryStatusFilter } from "@/components/inquiries/inbox/inquiry-status-filter";
import { InquiryList } from "@/components/inquiries/list/inquiry-list";
import { useInquiryFilters } from "@/hooks/inquiries/use-inquiry-filters";
import type {
  InquiryListItem,
  InquiryOption,
  InquiryStatus,
} from "@/lib/inquiries";

type InquiryInboxProps = {
  inquiries: InquiryListItem[];
  statusCounts: Record<InquiryStatus, number>;
  intentOptions: InquiryOption[];
  initialStatus: InquiryStatus;
};

export function InquiryInbox({
  inquiries,
  statusCounts,
  intentOptions,
  initialStatus,
}: InquiryInboxProps) {
  const filters = useInquiryFilters(inquiries, initialStatus);

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
            options={intentOptions}
            onChange={filters.setIntent}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 text-sm">
          <p className="text-muted-foreground">
            총
            <strong className="text-foreground">
              {filters.filteredInquiries.length}
            </strong>
            건
          </p>
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

        {filters.filteredInquiries.length === 0 ? (
          <InquiryEmptyState onReset={filters.resetFilters} />
        ) : (
          <InquiryList
            inquiries={filters.paginatedInquiries}
            currentPage={filters.currentPage}
            totalPages={filters.totalPages}
            onPageChange={filters.setCurrentPage}
          />
        )}
      </section>
    </div>
  );
}
