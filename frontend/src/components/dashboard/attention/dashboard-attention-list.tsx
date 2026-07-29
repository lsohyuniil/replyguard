"use client";

import { useMemo } from "react";
import { AttentionList } from "@/components/dashboard/attention/attention-list";
import { useInquiriesQuery } from "@/hooks/inquiries/use-inquiries-query";
import { mapAttentionInquiry } from "@/lib/dashboard";
import { inquiryReceivedAtFormatter } from "@/lib/inquiries";

export function DashboardAttentionList() {
  const inquiryQuery = useInquiriesQuery({
    search: "",
    status: "ACTION_REQUIRED",
    intent: "ALL",
    page: 1,
    pageSize: 4,
  });
  const inquiries = useMemo(
    () =>
      (inquiryQuery.data?.items ?? []).map((inquiry) =>
        mapAttentionInquiry(inquiry, inquiryReceivedAtFormatter),
      ),
    [inquiryQuery.data?.items],
  );

  if (inquiryQuery.isPending) {
    return <AttentionList state={{ kind: "loading" }} />;
  }

  if (inquiryQuery.isError) {
    return (
      <AttentionList
        state={{
          kind: "error",
          error: inquiryQuery.error,
          onRetry: () => inquiryQuery.refetch(),
        }}
      />
    );
  }

  return (
    <AttentionList
      state={{
        kind: "success",
        inquiries,
        totalCount: inquiryQuery.data.total_count,
      }}
    />
  );
}
