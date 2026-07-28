import type {
  DashboardTone,
  DistributionItem,
} from "@/lib/dashboard/types";

const distributionTones: DashboardTone[] = [
  "accent",
  "success",
  "warning",
  "danger",
  "muted",
];

export function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function mapDistribution<T extends { count: number; label: string }>(
  items: T[],
  keyFor: (item: T) => string,
): DistributionItem[] {
  return items.map((item, index) => ({
    key: keyFor(item),
    label: item.label,
    count: item.count,
    tone: distributionTones[index % distributionTones.length],
  }));
}
