export function InquiryListHeader() {
  return (
    <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(150px,0.8fr)_120px_140px_24px] gap-4 border-b border-border bg-surface-muted px-6 py-3 text-xs font-bold text-muted-foreground md:grid">
      <span>문의</span>
      <span>고객</span>
      <span>유형</span>
      <span>상태·수신</span>
      <span className="sr-only">상세</span>
    </div>
  );
}
