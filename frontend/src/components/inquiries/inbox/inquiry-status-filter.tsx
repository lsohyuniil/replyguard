import { inquiryStatusOptions } from "@/lib/inquiries";
import type { InquiryStatus } from "@/lib/inquiries";

type InquiryStatusFilterProps = {
  value: InquiryStatus;
  counts: Record<InquiryStatus, number>;
  onChange: (value: InquiryStatus) => void;
};

export function InquiryStatusFilter({
  value,
  counts,
  onChange,
}: InquiryStatusFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {inquiryStatusOptions.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border p-4 text-left transition-colors ${
              selected
                ? "border-accent bg-accent-soft"
                : "border-border bg-surface hover:bg-surface-hover"
            }`}
          >
            <span className="text-sm font-semibold text-muted-foreground">
              {option.label}
            </span>
            <strong className="mt-2 block text-2xl text-foreground">
              {counts[option.value]}건
            </strong>
          </button>
        );
      })}
    </div>
  );
}
