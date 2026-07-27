"use client";

import SearchIcon from "@mui/icons-material/SearchRounded";
import { useMemo, useState } from "react";
import { Pagination } from "@/components/common/pagination";
import { InquiryListRow } from "@/components/inquiries/inquiry-list-row";
import {
  inquiryStatusOptions,
  type InquiryListItem,
  type InquiryStatus,
} from "@/lib/inquiry-data";

type InquiryInboxProps = {
  inquiries: InquiryListItem[];
  statusCounts: Record<InquiryStatus, number>;
  intentOptions: { value: string; label: string }[];
  initialStatus: InquiryStatus;
};

const PAGE_SIZE = 5;

export function InquiryInbox({
  inquiries,
  statusCounts,
  intentOptions,
  initialStatus,
}: InquiryInboxProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InquiryStatus>(initialStatus);
  const [intent, setIntent] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredInquiries = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("ko-KR");

    return inquiries.filter((inquiry) => {
      const matchesStatus = status === "ALL" || inquiry.status === status;
      const matchesIntent = intent === "ALL" || inquiry.intent === intent;
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
  }, [inquiries, intent, search, status]);

  const totalPages = Math.ceil(filteredInquiries.length / PAGE_SIZE);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setIntent("ALL");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {inquiryStatusOptions.map((option) => {
          const selected = status === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setStatus(option.value);
                setCurrentPage(1);
              }}
              className={`rounded-2xl border p-4 text-left transition-colors ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-surface hover:bg-surface-hover"
              }`}
            >
              <span className="text-sm font-semibold text-muted-foreground">
                {option.label}
              </span>
              <strong className="mt-2 block text-2xl text-foreground">
                {statusCounts[option.value]}건
              </strong>
            </button>
          );
        })}
      </div>

      <section
        className="overflow-hidden rounded-2xl border border-border bg-surface"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[minmax(0,1fr)_180px] sm:p-5">
          <label className="relative block">
            <span className="sr-only">문의 검색</span>
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="고객명, 이메일, 제목 검색"
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
            />
          </label>

          <label>
            <span className="sr-only">문의 유형</span>
            <select
              value={intent}
              onChange={(event) => {
                setIntent(event.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-accent"
            >
              <option value="ALL">모든 문의 유형</option>
              {intentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3 text-sm">
          <p className="text-muted-foreground">
            총{" "}
            <strong className="text-foreground">
              {filteredInquiries.length}
            </strong>
            건
          </p>
          {(search || status !== "ALL" || intent !== "ALL") && (
            <button
              type="button"
              onClick={resetFilters}
              className="font-semibold text-accent hover:underline"
            >
              필터 초기화
            </button>
          )}
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-foreground">
              조건에 맞는 문의가 없습니다.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              검색어나 필터를 변경해 보세요.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              전체 문의 보기
            </button>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(150px,0.8fr)_120px_140px_24px] gap-4 border-b border-border bg-surface-muted px-6 py-3 text-xs font-bold text-muted-foreground md:grid">
              <span>문의</span>
              <span>고객</span>
              <span>유형</span>
              <span>상태·수신</span>
              <span className="sr-only">상세</span>
            </div>
            <ul className="divide-y divide-border">
              {paginatedInquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <InquiryListRow {...inquiry} />
                </li>
              ))}
            </ul>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
