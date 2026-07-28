"use client";

import Link from "next/link";
import { AgentRunCard } from "@/components/inquiries/detail/agent-run-card";
import { AnswerDraftCard } from "@/components/inquiries/detail/answer-draft-card";
import { InquiryContext } from "@/components/inquiries/detail/inquiry-context";
import { InquiryDetailHeader } from "@/components/inquiries/detail/inquiry-detail-header";
import { MessageThread } from "@/components/inquiries/detail/message-thread";
import { OrderSummary } from "@/components/inquiries/detail/order-summary";
import { PolicyEvidence } from "@/components/inquiries/detail/policy-evidence";
import { useInquiryDetailQuery } from "@/hooks/inquiries/use-inquiry-detail-query";
import { ApiError } from "@/lib/api/client";

export function InquiryDetail({ inquiryId }: { inquiryId: string }) {
  const inquiryQuery = useInquiryDetailQuery(inquiryId);

  if (inquiryQuery.isPending) {
    return <InquiryDetailLoading />;
  }

  if (inquiryQuery.isError) {
    return (
      <InquiryDetailError
        notFound={
          inquiryQuery.error instanceof ApiError &&
          inquiryQuery.error.status === 404
        }
        onRetry={() => inquiryQuery.refetch()}
      />
    );
  }

  const inquiry = inquiryQuery.data;

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-7">
      <InquiryDetailHeader inquiry={inquiry} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.75fr)]">
        <div className="space-y-6">
          <MessageThread messages={inquiry.messages} />
          <AnswerDraftCard draft={inquiry.answer_draft} />
        </div>

        <aside className="space-y-6">
          <OrderSummary
            order={inquiry.order}
            candidates={inquiry.order_candidates}
          />
          <InquiryContext
            collectedInformation={inquiry.collected_information}
            requiredAction={inquiry.required_action}
          />
          <PolicyEvidence policies={inquiry.policies} />
          <AgentRunCard agentRun={inquiry.agent_run} />
        </aside>
      </div>
    </div>
  );
}

function InquiryDetailLoading() {
  return (
    <div
      role="status"
      className="mx-auto grid min-h-[480px] w-full max-w-[1440px] place-items-center rounded-2xl border border-border bg-surface text-sm text-muted-foreground"
    >
      문의 상세 정보를 불러오는 중입니다.
    </div>
  );
}

function InquiryDetailError({
  notFound,
  onRetry,
}: {
  notFound: boolean;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto grid min-h-[480px] w-full max-w-[1440px] place-items-center rounded-2xl border border-border bg-surface px-6 text-center"
    >
      <div>
        <h1 className="text-xl font-bold text-foreground">
          {notFound
            ? "문의 정보를 찾을 수 없습니다."
            : "문의 상세 정보를 불러오지 못했습니다."}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {notFound
            ? "삭제되었거나 잘못된 문의 주소입니다."
            : "일시적으로 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요."}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/inquiries"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground"
          >
            문의함으로 이동
          </Link>
          {!notFound && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
