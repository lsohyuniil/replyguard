import { apiFetch } from "@/lib/api/client";
import type { DashboardSummaryResponse } from "@/lib/dashboard/types";

export function fetchDashboardSummary(signal?: AbortSignal) {
  return apiFetch<DashboardSummaryResponse>("/dashboard/summary", {
    signal,
  });
}
