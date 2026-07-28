import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded";
import Link from "next/link";
import {
  detailIntentLabels,
  detailStageLabels,
  detailStatusLabels,
  formatDetailDateTime,
} from "@/lib/inquiries/detail-formatters";
import type { InquiryDetailResponse } from "@/lib/inquiries";

const statusStyles = {
  IN_PROGRESS: "bg-accent-soft text-accent",
  ACTION_REQUIRED: "bg-warning-soft text-warning",
  COMPLETED: "bg-success-soft text-success",
};

export function InquiryDetailHeader({
  inquiry,
}: {
  inquiry: InquiryDetailResponse;
}) {
  return (
    <header>
      <Link
        href="/inquiries"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-accent"
      >
        <ArrowBackIcon className="size-5" />
        문의함으로 돌아가기
      </Link>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
              {detailIntentLabels[inquiry.intent]}
            </span>
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-bold ${statusStyles[inquiry.status]}`}
            >
              {detailStatusLabels[inquiry.status]}
            </span>
            <span className="rounded-md bg-surface-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
              {detailStageLabels[inquiry.stage]}
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
            {inquiry.subject}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {inquiry.customer_name ?? inquiry.customer_email} ·{" "}
            {inquiry.customer_email}
          </p>
        </div>
        <div className="shrink-0 text-sm text-muted-foreground lg:text-right">
          <p>수신 {formatDetailDateTime(inquiry.received_at)}</p>
          <p className="mt-1">수정 {formatDetailDateTime(inquiry.updated_at)}</p>
        </div>
      </div>
    </header>
  );
}
