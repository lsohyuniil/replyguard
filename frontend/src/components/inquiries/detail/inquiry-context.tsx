import AssignmentIcon from "@mui/icons-material/AssignmentRounded";
import { DetailSection } from "@/components/inquiries/detail/detail-section";
import { formatCollectedValue } from "@/lib/inquiries/detail-formatters";

export function InquiryContext({
  collectedInformation,
  requiredAction,
  orderNumber,
  attachmentCount,
}: {
  collectedInformation: Record<string, unknown>;
  requiredAction: Record<string, unknown> | null;
  orderNumber: string | null;
  attachmentCount: number;
}) {
  const collectedEntries = Object.entries(collectedInformation);
  const actionLabel =
    typeof requiredAction?.label === "string"
      ? requiredAction.label
      : undefined;

  return (
    <DetailSection
      title="필수정보 수집 결과"
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

      <dl className="divide-y divide-border">
        <InformationRow
          label="주문 식별"
          value={orderNumber ? `${orderNumber} 확인` : "확인 필요"}
          complete={Boolean(orderNumber)}
        />
        {collectedEntries.map(([key, value]) => (
          <InformationRow
            key={key}
            label={collectedInformationLabels[key] ?? key}
            value={formatCollectedValue(value)}
            complete
          />
        ))}
        {attachmentCount > 0 && (
          <InformationRow
            label="첨부파일"
            value={`${attachmentCount}개 첨부됨`}
            complete
          />
        )}
      </dl>

      {collectedEntries.length === 0 &&
      !orderNumber &&
      attachmentCount === 0 ? (
        <p className="text-sm text-muted-foreground">
          수집된 추가 정보가 없습니다.
        </p>
      ) : null}
    </DetailSection>
  );
}

function InformationRow({
  label,
  value,
  complete,
}: {
  label: string;
  value: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`text-right font-bold ${
          complete ? "text-success" : "text-warning"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

const collectedInformationLabels: Record<string, string> = {
  desired_size: "희망 사이즈",
  worn_or_washed: "착용·세탁 여부",
  refund_reason: "환불 요청 사유",
  damage_type: "상품 상태",
  photo_attached: "상품 사진",
};
