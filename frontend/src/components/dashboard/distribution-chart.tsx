import type { DistributionItem } from "@/lib/dashboard-data";

type DistributionChartProps = {
  title: string;
  description: string;
  data: DistributionItem[];
};

const toneStyles = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  muted: "bg-muted-foreground",
};

export function DistributionChart({
  title,
  description,
  data,
}: DistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <section
      className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>

      {data.length === 0 || total === 0 ? (
        <div className="mt-6 grid h-40 place-items-center rounded-xl bg-surface-muted text-sm text-muted-foreground">
          표시할 분포 데이터가 없습니다.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {data.map((item) => {
            const percentage = (item.count / total) * 100;
            return (
              <div key={item.key}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`size-2.5 shrink-0 rounded-full ${toneStyles[item.tone]}`}
                    />
                    <span className="truncate font-medium text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold text-muted-foreground">
                    {item.count}건 · {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className={`h-full rounded-full ${toneStyles[item.tone]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
