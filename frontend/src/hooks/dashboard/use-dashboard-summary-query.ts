"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "@/lib/dashboard/api";

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: ({ signal }) => fetchDashboardSummary(signal),
  });
}
