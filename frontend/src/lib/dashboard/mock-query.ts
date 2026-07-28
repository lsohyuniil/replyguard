import dashboardFixture from "../../../../data/seeds/dashboard.json";
import { formatChange, mapDistribution } from "@/lib/dashboard/mapper";
import type { SummaryCardData } from "@/lib/dashboard/types";

// JSON 목데이터를 대시보드 컴포넌트에서 쓰기 좋은 형태로 정리함
export function getDashboardData() {
  const summary = dashboardFixture.summary;
  const comparison = dashboardFixture.comparison;

  const summaryCards: SummaryCardData[] = [
    {
      label: "전체 문의",
      value: `${summary.total_inquiries}건`,
      change: formatChange(comparison.total_inquiries_change_percent),
      isImprovement: comparison.total_inquiries_change_percent > 0,
      helper: "지난 7일 대비",
      tone: "accent",
    },
    {
      label: "자동 발송",
      value: `${summary.auto_sent}건`,
      change: formatChange(comparison.auto_sent_change_percent),
      isImprovement: comparison.auto_sent_change_percent > 0,
      helper: `자동 처리율 ${summary.automation_rate.toFixed(0)}%`,
      tone: "success",
    },
    {
      label: "확인 필요",
      value: `${summary.action_required}건`,
      change: formatChange(comparison.action_required_change_percent),
      isImprovement: comparison.action_required_change_percent < 0,
      helper: "지난 7일 대비",
      tone: "warning",
    },
    {
      label: "처리 실패",
      value: `${summary.failed}건`,
      change: formatChange(comparison.failed_change_percent),
      isImprovement: comparison.failed_change_percent < 0,
      helper: "지난 7일 대비",
      tone: "danger",
    },
  ];

  return {
    periodLabel: `${dashboardFixture.period.from.replaceAll("-", ".")} – ${dashboardFixture.period.to.replaceAll("-", ".")}`,
    summaryCards,
    dailyTrend: dashboardFixture.daily_trend,
    statusDistribution: mapDistribution(
      dashboardFixture.status_distribution,
      (item) => item.status,
    ),
    intentDistribution: mapDistribution(
      dashboardFixture.intent_distribution,
      (item) => item.intent,
    ),
    completionDistribution: mapDistribution(
      dashboardFixture.completion_distribution,
      (item) => item.completion_type,
    ),
  };
}
