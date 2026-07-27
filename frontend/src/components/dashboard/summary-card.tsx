type SummaryCardProps = {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  helper: string;
  tone: "accent" | "success" | "warning" | "danger" | "muted";
};

const toneStyles = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  muted: "bg-surface-muted text-muted-foreground",
};

export function SummaryCard({
  label,
  value,
  change,
  changeDirection,
  helper,
  tone,
}: SummaryCardProps) {
  const isImprovement =
    (label === "전체 문의" && changeDirection === "up") ||
    (label !== "전체 문의" && changeDirection === "down") ||
    label === "자동 발송";

  return (
    <article
      className="rounded-2xl border border-border bg-surface p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <span
          aria-hidden="true"
          className={`grid size-9 place-items-center rounded-xl text-sm font-bold ${toneStyles[tone]}`}
        >
          {label.slice(0, 1)}
        </span>
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
