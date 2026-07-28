import PolicyIcon from "@mui/icons-material/PolicyRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import type { InquiryPolicy } from "@/lib/inquiries";

export function PolicyEvidence({ policies }: { policies: InquiryPolicy[] }) {
  return (
    <DetailSection
      title="정책 근거"
      icon={<PolicyIcon className="size-5 text-accent" />}
    >
      {policies.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          연결된 정책 근거가 없습니다.
        </p>
      ) : (
        <ul className="space-y-4">
          {policies.map((policy) => (
            <li key={policy.version_id}>
              <div className="flex items-center justify-between gap-3">
                <p className="font-bold text-foreground">{policy.title}</p>
                <span className="shrink-0 rounded-md bg-success-soft px-2 py-1 text-xs font-bold text-success">
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
                    className="rounded-xl border-l-4 border-accent bg-surface-muted px-4 py-3 text-sm leading-6 text-foreground"
                  >
                    {chunk.content}
                  </blockquote>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </DetailSection>
  );
}
