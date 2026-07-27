"use client";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightIcon from "@mui/icons-material/ChevronRightRounded";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="목록 페이지"
      className="flex items-center justify-center gap-2 border-t border-border px-4 py-4"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-5" />
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            aria-label={`${page}페이지`}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={`size-9 rounded-lg text-sm font-semibold transition-colors ${
              page === currentPage
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <span className="px-3 text-sm font-semibold text-muted-foreground sm:hidden">
        {currentPage} / {totalPages}
      </span>

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRightIcon aria-hidden="true" className="size-5" />
      </button>
    </nav>
  );
}
