import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import { formatDetailDateTime } from "@/lib/inquiries/detail-formatters";
import type { InquiryDetailResponse } from "@/lib/inquiries";

type AnswerDraft = InquiryDetailResponse["answer_draft"];

const draftStatusLabels = {
  DRAFT: "작성 중",
  WAITING_APPROVAL: "승인 대기",
  APPROVED: "승인됨",
  REJECTED: "반려됨",
  SENT: "발송됨",
  INVALIDATED: "무효화됨",
};

export function AnswerDraftCard({
  draft,
  orderNumber,
  policyTitles,
}: {
  draft: AnswerDraft;
  orderNumber: string | null;
  policyTitles: string[];
}) {
  return (
    <DetailSection
      title="고객에게 보낼 답변"
      description={
        draft
          ? "AI 초안 · 저장과 승인 기능은 운영자 인증 연결 후 사용할 수 있습니다."
          : "직접 답변 · 저장과 발송 기능은 운영자 인증 연결 후 사용할 수 있습니다."
      }
      icon={<AutoAwesomeIcon className="size-5 text-accent" />}
    >
      <>
        {draft && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-md bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning">
              {draftStatusLabels[draft.status]}
            </span>
            <span className="text-xs text-muted-foreground">
              v{draft.version} · {formatDetailDateTime(draft.created_at)}
            </span>
          </div>
        )}

        <textarea
          className={`${draft ? "mt-4" : ""} min-h-64 w-full resize-y rounded-xl border border-border bg-surface p-4 text-sm leading-7 text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-100`}
          value={draft?.final_content ?? draft?.ai_content ?? ""}
          placeholder="고객에게 보낼 답변을 작성해 주세요."
          disabled
          aria-label="고객에게 보낼 답변"
        />

        {draft && (orderNumber || policyTitles.length > 0) && (
          <p className="mt-3 rounded-xl bg-surface-muted px-4 py-3 text-xs leading-5 text-muted-foreground">
            이 답변은
            {orderNumber && (
              <>
                {" "}
                주문 <strong className="text-foreground">{orderNumber}</strong>
              </>
            )}
            {orderNumber && policyTitles.length > 0 && "과"}
            {policyTitles.length > 0 && (
              <>
                {" "}
                정책{" "}
                <strong className="text-foreground">
                  {policyTitles.join(", ")}
                </strong>
              </>
            )}
            을 근거로 생성되었습니다.
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {draft ? (
            <button
              type="button"
              disabled
              className="rounded-xl border border-danger/40 px-4 py-2.5 text-sm font-bold text-danger disabled:cursor-not-allowed disabled:opacity-50"
            >
              Agent 판단 반려
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              disabled
              className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-bold text-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              임시 저장
            </button>
            <button
              type="button"
              disabled
              className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {draft ? "승인 후 발송" : "직접 답변 발송"}
            </button>
          </div>
        </div>
      </>
    </DetailSection>
  );
}
