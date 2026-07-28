type InquiryEmptyStateProps = {
  onReset: () => void;
};

export function InquiryEmptyState({ onReset }: InquiryEmptyStateProps) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-semibold text-foreground">
        조건에 맞는 문의가 없습니다.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        검색어나 필터를 변경해 보세요.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
      >
        전체 문의 보기
      </button>
    </div>
  );
}
