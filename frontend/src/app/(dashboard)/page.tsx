import { AttentionList } from "@/components/dashboard/attention-list";
import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { InquiryTrendChart } from "@/components/dashboard/inquiry-trend-chart";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { getDashboardData } from "@/lib/dashboard-data";

export default function DashboardPage() {
  const dashboard = getDashboardData();

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7">
      <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-accent">운영 현황</p>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
            대시보드
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            고객 문의 처리 상태와 AI 자동화 결과를 한눈에 확인하세요.
          </p>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {dashboard.periodLabel}
        </p>
      </section>

      <section
        aria-label="주요 지표"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboard.summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
        <InquiryTrendChart data={dashboard.dailyTrend} />
        <DistributionChart
          title="처리 상태"
          description="최근 7일 문의의 현재 처리 상태입니다."
          data={dashboard.statusDistribution}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <DistributionChart
          title="문의 유형"
          description="최근 7일 문의의 유형별 분포입니다."
          data={dashboard.intentDistribution}
        />
        <DistributionChart
          title="완료 방식"
          description="완료된 문의의 발송 방식을 비교합니다."
          data={dashboard.completionDistribution}
        />
      </section>

      <AttentionList inquiries={dashboard.attentionInquiries} />
    </div>
  );
}
