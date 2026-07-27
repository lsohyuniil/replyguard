import type { TrendPoint } from "@/lib/dashboard-data";

type InquiryTrendChartProps = {
  data: TrendPoint[];
};

function createPoints(data: TrendPoint[], width: number, height: number) {
  if (data.length === 0) return "";

  const maximum = Math.max(...data.map((point) => point.total), 1);
  const step = data.length === 1 ? 0 : width / (data.length - 1);

  return data
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.total / maximum) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export function InquiryTrendChart({ data }: InquiryTrendChartProps) {
  const points = createPoints(data, 600, 150);
  const total = data.reduce((sum, point) => sum + point.total, 0);
  const hasData = data.some((point) => point.total > 0);

  return (
    <section
      className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground">문의 처리 추이</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            최근 7일 동안 접수된 문의 {total}건
          </p>
        </div>
        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">
          일별
        </span>
      </div>

      {!hasData ? (
        <div className="mt-6 grid h-48 place-items-center rounded-xl bg-surface-muted text-sm text-muted-foreground">
          표시할 문의 추이가 없습니다.
        </div>
      ) : (
        <>
          <div className="mt-7 h-44 w-full" role="img" aria-label="최근 7일 문의 추이 선 그래프">
            <svg viewBox="-8 -8 616 174" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 50, 100, 150].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="600"
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 6"
                />
              ))}
              <polygon
                points={`0,150 ${points} 600,150`}
                fill="url(#trendArea)"
              />
              <polyline
                points={points}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {points.split(" ").map((point, index) => {
                const [cx, cy] = point.split(",");
                return (
                  <circle
                    key={data[index].date}
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="var(--surface)"
                    stroke="var(--accent)"
                    strokeWidth="3"
                  />
                );
              })}
            </svg>
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {data.map((point) => (
              <div key={point.date} className="text-center">
                <p className="text-xs font-bold text-foreground">{point.total}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {Number(point.date.slice(-2))}일
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
