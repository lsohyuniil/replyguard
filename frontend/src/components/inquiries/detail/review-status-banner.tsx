import type { InquiryDetailResponse } from "@/lib/inquiries";

const stageContent = {
  ANALYZING: {
    title: "AI가 문의를 분석하고 있습니다",
    description:
      "문의 유형과 주문·정책 정보를 확인하고 있습니다. 분석이 끝나면 다음 처리 단계가 표시됩니다.",
  },
  WAITING_CUSTOMER: {
    title: "고객의 회신을 기다리고 있습니다",
    description:
      "처리에 필요한 정보를 고객에게 요청했습니다. 같은 이메일 스레드로 회신이 오면 처리를 이어갑니다.",
  },
  SENDING: {
    title: "고객에게 답변을 발송하고 있습니다",
    description:
      "답변 발송 결과를 확인하고 있습니다. 중복 발송을 막기 위해 잠시 기다려 주세요.",
  },
  WAITING_APPROVAL: {
    title: "운영자 확인이 필요합니다",
    description:
      "주문정보와 정책 확인이 완료되었습니다. 고객에게 답변을 발송하기 전에 근거와 답변 초안을 검토해 주세요.",
  },
  MANUAL_REQUIRED: {
    title: "운영자의 직접 처리가 필요합니다",
    description:
      "자동으로 판단할 수 없는 항목이 있습니다. 필요한 행동과 관련 정보를 확인해 주세요.",
  },
  FAILED: {
    title: "자동 처리 중 문제가 발생했습니다",
    description:
      "현재 자동 처리를 완료하지 못했습니다. 오류 내용을 확인한 뒤 다시 시도하거나 직접 처리해 주세요.",
  },
  DONE: {
    title: "문의 처리가 완료되었습니다",
    description:
      "고객에게 최종 답변이 발송되었습니다. 아래에서 처리 내용과 사용된 근거를 확인할 수 있습니다.",
  },
} satisfies Record<
  InquiryDetailResponse["stage"],
  { title: string; description: string }
>;

const stageBadges = {
  ANALYZING: "분석 중",
  WAITING_CUSTOMER: "고객 회신 대기",
  SENDING: "발송 중",
  WAITING_APPROVAL: "답변 승인 대기",
  MANUAL_REQUIRED: "직접 처리 필요",
  FAILED: "처리 실패",
  DONE: "처리 완료",
} satisfies Record<InquiryDetailResponse["stage"], string>;

export function ReviewStatusBanner({
  stage,
}: {
  stage: InquiryDetailResponse["stage"];
}) {
  const content = stageContent[stage];
  const isDanger = stage === "FAILED";
  const isComplete = stage === "DONE";

  return (
    <section
      className={`rounded-2xl border p-5 sm:p-6 ${
        isDanger
          ? "border-danger/35 bg-danger-soft"
          : isComplete
            ? "border-success/35 bg-success-soft"
            : "border-warning/35 bg-warning-soft"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            className={`font-bold ${
              isDanger
                ? "text-danger"
                : isComplete
                  ? "text-success"
                  : "text-warning"
            }`}
          >
            {content.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {content.description}
          </p>
        </div>
        <span
          className={`shrink-0 text-xs font-bold ${
            isDanger
              ? "text-danger"
              : isComplete
                ? "text-success"
                : "text-warning"
          }`}
        >
          {stageBadges[stage]}
        </span>
      </div>
    </section>
  );
}
