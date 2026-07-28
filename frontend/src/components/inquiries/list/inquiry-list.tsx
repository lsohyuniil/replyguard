import { Pagination } from "@/components/common/pagination";
import { InquiryListHeader } from "@/components/inquiries/list/inquiry-list-header";
import { InquiryListRow } from "@/components/inquiries/list/inquiry-list-row";
import type { InquiryListItem } from "@/lib/inquiries";

type InquiryListProps = {
  inquiries: InquiryListItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function InquiryList({
  inquiries,
  currentPage,
  totalPages,
  onPageChange,
}: InquiryListProps) {
  return (
    <>
      <InquiryListHeader />
      <ul className="divide-y divide-border">
        {inquiries.map((inquiry) => (
          <li key={inquiry.id}>
            <InquiryListRow {...inquiry} />
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
