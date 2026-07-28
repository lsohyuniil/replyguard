import AssignmentIcon from "@mui/icons-material/AssignmentRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import { formatCollectedValue } from "@/lib/inquiries/detail-formatters";

export function InquiryContext({
  collectedInformation,
  requiredAction,
}: {
  collectedInformation: Record<string, unknown>;
  requiredAction: Record<string, unknown> | null;
}) {
  const collectedEntries = Object.entries(collectedInformation);
  const actionLabel =
    typeof requiredAction?.label === "string"
      ? requiredAction.label
      : undefined;

  return (
    <DetailSection
      title="처리 정보"
      icon={<AssignmentIcon className="size-5 text-accent" />}
    >
      {actionLabel && (
        <div className="mb-5 rounded-xl bg-warning-soft p-4">
          <p className="text-xs font-bold text-warning">필요한 행동</p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {actionLabel}
          </p>
        </div>
      )}

      {collectedEntries.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          수집된 추가 정보가 없습니다.
        </p>
      ) : (
        <dl className="space-y-3">
          {collectedEntries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="text-right font-semibold text-foreground">
                {formatCollectedValue(value)}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </DetailSection>
  );
}
