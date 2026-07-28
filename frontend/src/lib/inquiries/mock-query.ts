import inquiryFixture from "../../../../data/seeds/inquiries.json";
import { mapInquiryListItem } from "@/lib/inquiries/mapper";
import type {
  InquiryListItem,
  InquiryOption,
  InquiryStatus,
} from "@/lib/inquiries/types";

export function getInquiryListData() {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });

  const inquiries = [...inquiryFixture]
    .sort((a, b) => b.received_at.localeCompare(a.received_at))
    .map((inquiry) => mapInquiryListItem(inquiry, formatter));

  const statusCounts: Record<InquiryStatus, number> = {
    ALL: inquiries.length,
    IN_PROGRESS: countStatus(inquiries, "IN_PROGRESS"),
    ACTION_REQUIRED: countStatus(inquiries, "ACTION_REQUIRED"),
    COMPLETED: countStatus(inquiries, "COMPLETED"),
  };

  const intentOptions: InquiryOption[] = Array.from(
    new Map(
      inquiries.map((item) => [
        item.intent,
        { value: item.intent, label: item.intentLabel },
      ]),
    ).values(),
  );

  return { inquiries, statusCounts, intentOptions };
}

function countStatus(
  inquiries: InquiryListItem[],
  status: InquiryListItem["status"],
) {
  return inquiries.filter((item) => item.status === status).length;
}
