import PolicyIcon from "@mui/icons-material/PolicyRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import type { InquiryPolicy } from "@/lib/inquiries";

export function PolicyEvidence({ policies }: { policies: InquiryPolicy[] }) {
  return (
    <DetailSection
      title="참고 정책"
      description={`검색 근거 ${policies.length}건`}
      icon={<PolicyIcon className="size-5 text-accent" />}
    >
      {policies.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          연결된 정책 근거가 없습니다.
        </p>
      ) : (
        <ul className="space-y-4">
          {policies.map((policy) => (
            <li
              key={policy.version_id}
              className="rounded-xl border border-accent/20 bg-accent-soft/40 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-foreground">{policy.title}</p>
                <span className="shrink-0 rounded-md bg-surface px-2 py-1 text-xs font-bold text-accent">
                  v{policy.version}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {policy.category}
              </p>
              <div className="mt-3 space-y-2">
                {policy.chunks.map((chunk) => (
                  <blockquote
                    key={chunk.id}
                    className="mt-3 text-sm leading-6 text-foreground"
                  >
                    {chunk.content}
                  </blockquote>
                ))}
              </div>
              <p className="mt-3 text-xs font-bold text-accent">
                원문에서 확인
              </p>
            </li>
          ))}
        </ul>
      )}
    </DetailSection>
  );
}
