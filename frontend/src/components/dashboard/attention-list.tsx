import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import Link from "next/link";
import { InquiryListRow } from "@/components/inquiries/inquiry-list-row";
import type { AttentionInquiry } from "@/lib/dashboard-data";

type AttentionListProps = {
  inquiries: AttentionInquiry[];
};

export function AttentionList({ inquiries }: AttentionListProps) {
  const visibleInquiries = inquiries.slice(0, 4);

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
          {visibleInquiries.map((inquiry) => (
            <li key={inquiry.id}>
              <InquiryListRow
                {...inquiry}
                statusLabel={inquiry.stageLabel}
              />
            </li>
          ))}
        </ul>
      )}

      {inquiries.length > 0 && (
        <div className="border-t border-border px-5 py-4 sm:px-6">
          <Link
            href="/inquiries?status=ACTION_REQUIRED"
            className="flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-bold text-accent transition-colors hover:bg-accent-soft"
          >
            문의함 전체 보기
            <ArrowForwardIcon aria-hidden="true" className="size-5" />
          </Link>
        </div>
      )}
    </section>
  );
}
