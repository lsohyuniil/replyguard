type SummaryCardProps = {
  label: string;
  value: string;
  helper: string;
  tone: "accent" | "success" | "warning" | "danger" | "muted";
};

const toneStyles = {
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  muted: "text-muted-foreground",
};

export function SummaryCard({
  label,
  value,
  helper,
  tone,
}: SummaryCardProps) {
  return (
    <article
      className="rounded-2xl border border-border bg-surface p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className={`${toneStyles[tone]} text-sm font-semibold`}>{label}</p>
      </div>
      <p className="mt-5 text-2xl font-bold tracking-[-0.04em] text-foreground">
        {value}
      </p>
      <p className="mt-3 text-xs text-muted-foreground">{helper}</p>
    </article>
  );
}
