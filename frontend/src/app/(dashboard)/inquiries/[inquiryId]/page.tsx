import { InquiryDetail } from "@/components/inquiries";

type InquiryDetailPageProps = {
  params: Promise<{ inquiryId: string }>;
};

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const { inquiryId } = await params;
  return <InquiryDetail inquiryId={inquiryId} />;
}
