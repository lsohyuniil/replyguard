type SummaryCardProps = {
  label: string;
  value: string;
  change: string;
  isImprovement: boolean;
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
  change,
  isImprovement,
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
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={`font-bold ${isImprovement ? "text-success" : "text-accent"}`}
        >
          {change}
        </span>
        <span className="text-muted-foreground">{helper}</span>
      </div>
    </article>
  );
}
