import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import Link from "next/link";
import type { InquiryBadgeTone } from "@/lib/inquiries";

type InquiryListRowProps = {
  id: string;
  subject: string;
  preview: string;
  customerName: string;
  customerEmail: string;
  intentLabel: string;
  statusLabel: string;
  statusTone: InquiryBadgeTone;
  receivedAt: string;
};

const statusStyles: Record<InquiryBadgeTone, string> = {
  accent: "bg-accent-soft text-accent",
  warning: "bg-warning-soft text-warning",
  success: "bg-success-soft text-success",
  danger: "bg-danger-soft text-danger",
};

export function InquiryListRow({
  id,
  subject,
  preview,
  customerName,
  customerEmail,
  intentLabel,
  statusLabel,
  statusTone,
  receivedAt,
}: InquiryListRowProps) {
  return (
    <Link
      href={`/inquiries/${id}`}
      className="group block px-5 py-5 transition-colors hover:bg-surface-hover md:px-6"
    >
      <div className="mb-3 flex items-start justify-between gap-3 md:hidden">
        <div className="flex min-w-0 flex-wrap gap-2">
          <span className="rounded-md bg-accent-soft px-2 py-1 text-[11px] font-bold text-accent">
            {intentLabel}
          </span>
          <span
            className={`rounded-md px-2 py-1 text-[11px] font-bold ${statusStyles[statusTone]}`}
          >
            {statusLabel}
          </span>
        </div>
        <span className="shrink-0 pt-1 text-[11px] text-muted-foreground">
          {receivedAt}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(150px,0.8fr)_120px_140px_24px]">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground group-hover:text-accent">
            {subject}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {preview}
          </p>
          <p className="mt-2 text-xs text-muted-foreground md:hidden">
            {customerName}
          </p>
        </div>

        <div className="hidden min-w-0 md:block">
          <p className="truncate text-sm font-semibold text-foreground">
            {customerName}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {customerEmail}
          </p>
        </div>

        <span className="hidden w-fit rounded-md bg-accent-soft px-2 py-1 text-xs font-bold text-accent md:inline-flex">
          {intentLabel}
        </span>

        <div className="hidden md:block">
          <span
            className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${statusStyles[statusTone]}`}
          >
            {statusLabel}
          </span>
          <p className="mt-2 text-xs text-muted-foreground">{receivedAt}</p>
        </div>

        <ArrowForwardIcon
          aria-hidden="true"
          className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
        />
      </div>
    </Link>
  );
}
