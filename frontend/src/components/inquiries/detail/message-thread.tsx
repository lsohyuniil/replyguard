import EmailIcon from "@mui/icons-material/EmailRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import { formatDetailDateTime } from "@/lib/inquiries/detail-formatters";
import type { InquiryMessage } from "@/lib/inquiries";

export function MessageThread({
  messages,
  gmailThreadId,
}: {
  messages: InquiryMessage[];
  gmailThreadId: string;
}) {
  return (
    <DetailSection
      title="이메일 대화"
      description={
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span>{messages.length}개의 메시지</span>
          <span className="font-mono text-xs">
            Gmail thread #{gmailThreadId}
          </span>
        </span>
      }
      icon={<EmailIcon className="size-5 text-accent" />}
    >
      {messages.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          저장된 이메일 메시지가 없습니다.
        </p>
      ) : (
        <ol className="space-y-5">
          {messages.map((message, index) => {
            const isOutbound = message.direction === "OUTBOUND";
            const senderLabel = isOutbound
              ? "자동 안내"
              : index === 0
                ? "고객"
                : "고객 회신";
            return (
              <li
                key={message.id}
                className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
              >
                <article
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-foreground sm:max-w-[78%] ${
                    isOutbound ? "bg-accent-soft" : "bg-surface-muted"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <strong>
                      {senderLabel}
                    </strong>
                    <span className="text-muted-foreground">
                      {formatDetailDateTime(message.occurred_at)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                    {message.body_text}
                  </p>
                  {message.attachments.length > 0 && (
                    <span className="mt-3 inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
                      첨부파일 {message.attachments.length}개
                    </span>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </DetailSection>
  );
}
