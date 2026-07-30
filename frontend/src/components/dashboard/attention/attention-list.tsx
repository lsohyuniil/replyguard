import ArrowForwardIcon from "@mui/icons-material/ArrowForwardRounded";
import Link from "next/link";
import { InquiryListRow } from "@/components/inquiries";
import { QueryErrorState } from "@/components/ui/query-error-state";
import type { AttentionInquiry } from "@/lib/dashboard";

type AttentionListState =
  | { kind: "loading" }
  | { kind: "error"; error: unknown; onRetry: () => void }
  | {
      kind: "success";
      inquiries: AttentionInquiry[];
      totalCount: number;
    };

type AttentionListProps = { state: AttentionListState };

export function AttentionList({ state }: AttentionListProps) {
  const totalCount = state.kind === "success" ? state.totalCount : 0;
  const countLabel =
    state.kind === "success" ? `${state.totalCount}건` : "—";

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
          {countLabel}
        </span>
      </div>

      <AttentionListBody state={state} />

      {state.kind === "success" && totalCount > 0 && (
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

function AttentionListBody({ state }: { state: AttentionListState }) {
  if (state.kind === "loading") {
    return (
      <div
        role="status"
        className="px-6 py-12 text-center text-sm text-muted-foreground"
      >
        확인할 문의를 불러오는 중입니다.
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <QueryErrorState
        title="확인 필요 문의를 불러오지 못했습니다."
        error={state.error}
        onRetry={state.onRetry}
        compact
      />
    );
  }

  if (state.inquiries.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-sm text-muted-foreground">
        지금 확인할 문의가 없습니다.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {state.inquiries.slice(0, 4).map((inquiry) => (
        <li key={inquiry.id}>
          <InquiryListRow
            {...inquiry}
            statusLabel={inquiry.stageLabel}
          />
        </li>
      ))}
    </ul>
  );
}
