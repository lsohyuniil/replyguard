import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import Link from "next/link";
import type { AttentionInquiry } from "@/lib/dashboard-data";

type AttentionListProps = {
  inquiries: AttentionInquiry[];
};

export function AttentionList({ inquiries }: AttentionListProps) {
  return (
    <section
      className="overflow-hidden rounded-2xl border border-border bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-bold text-foreground">
            확인 필요 문의
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            운영자의 판단이나 재시도가 필요한 문의입니다.
          </p>
        </div>
        <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-bold text-warning">
          {inquiries.length}건
        </span>
      </div>

      {inquiries.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          지금 확인할 문의가 없습니다.
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {inquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <Link
                href={`/inquiries/${inquiry.id}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-hover sm:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-accent-soft px-2 py-1 text-[11px] font-bold text-accent">
                      {inquiry.intentLabel}
                    </span>
                    <span className="text-xs font-medium text-warning">
                      {inquiry.stageLabel}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-foreground group-hover:text-accent">
                    {inquiry.subject}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {inquiry.customerName} · {inquiry.receivedAt}
                  </p>
                </div>
                <ArrowForwardIcon
                  aria-hidden="true"
                  className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
