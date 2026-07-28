import type {
  InquiryIntent,
  InquiryOption,
} from "@/lib/inquiries";

type InquiryIntentFilterProps = {
  value: InquiryIntent;
  options: InquiryOption[];
  onChange: (value: InquiryIntent) => void;
};

export function InquiryIntentFilter({
  value,
  options,
  onChange,
}: InquiryIntentFilterProps) {
  return (
    <label>
      <span className="sr-only">문의 유형</span>
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value as InquiryIntent)
        }
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-accent"
      >
        <option value="ALL">모든 문의 유형</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
