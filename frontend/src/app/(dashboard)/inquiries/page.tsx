import { InquiryInbox } from "@/components/inquiries/inquiry-inbox";
import {
  getInquiryListData,
  isInquiryStatus,
  type InquiryStatus,
} from "@/lib/inquiry-data";

type InquiriesPageProps = {
  searchParams: Promise<{ status?: string | string[] }>;
};

export default async function InquiriesPage({
  searchParams,
}: InquiriesPageProps) {
  const inquiryData = getInquiryListData();
  const statusParam = (await searchParams).status;
  const initialStatus: InquiryStatus = isInquiryStatus(statusParam)
    ? statusParam
    : "ALL";

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-7">
      <section>
        <p className="mb-2 text-sm font-semibold text-accent">고객 문의 관리</p>
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
          문의함
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          접수된 문의를 검색하고 처리 상태와 유형별로 확인하세요.
        </p>
      </section>

      <InquiryInbox {...inquiryData} initialStatus={initialStatus} />
    </div>
  );
}
