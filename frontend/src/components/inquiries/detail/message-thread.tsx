import EmailIcon from "@mui/icons-material/EmailRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import { formatDetailDateTime } from "@/lib/inquiries/detail-formatters";
import type { InquiryMessage } from "@/lib/inquiries";

export function MessageThread({ messages }: { messages: InquiryMessage[] }) {
  return (
    <DetailSection
      title="이메일 대화"
      description={`${messages.length}개의 메시지`}
      icon={<EmailIcon className="size-5 text-accent" />}
    >
      {messages.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          저장된 이메일 메시지가 없습니다.
        </p>
      ) : (
        <ol className="space-y-5">
          {messages.map((message) => {
            const isOutbound = message.direction === "OUTBOUND";
            return (
              <li
                key={message.id}
                className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
              >
                <article
                  className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[78%] ${
                    isOutbound
                      ? "bg-accent-soft text-foreground"
                      : "bg-surface-muted text-foreground"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <strong>
                      {message.sender_name ?? message.sender_email}
                    </strong>
                    <span className="text-muted-foreground">
                      {formatDetailDateTime(message.occurred_at)}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                    {message.body_text}
                  </p>
                  {message.attachments.length > 0 && (
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">
                      첨부파일 {message.attachments.length}개
                    </p>
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
