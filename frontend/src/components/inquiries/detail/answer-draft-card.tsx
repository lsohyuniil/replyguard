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

export function AnswerDraftCard({ draft }: { draft: AnswerDraft }) {
  return (
    <DetailSection
      title="AI 답변 초안"
      description="조회 전용 화면입니다. 승인과 수정 기능은 다음 단계에서 연결합니다."
      icon={<AutoAwesomeIcon className="size-5 text-accent" />}
    >
      {!draft ? (
        <p className="py-5 text-center text-sm text-muted-foreground">
          준비된 답변 초안이 없습니다.
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-md bg-warning-soft px-2.5 py-1 text-xs font-bold text-warning">
              {draftStatusLabels[draft.status]}
            </span>
            <span className="text-xs text-muted-foreground">
              v{draft.version} · {formatDetailDateTime(draft.created_at)}
            </span>
          </div>
          <div className="mt-4 whitespace-pre-wrap rounded-xl bg-surface-muted p-4 text-sm leading-7 text-foreground">
            {draft.final_content ?? draft.ai_content}
          </div>
        </>
      )}
    </DetailSection>
  );
}
