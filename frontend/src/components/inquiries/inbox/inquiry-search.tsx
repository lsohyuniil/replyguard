import SearchIcon from "@mui/icons-material/SearchRounded";

type InquirySearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function InquirySearch({ value, onChange }: InquirySearchProps) {
  return (
    <label className="relative block">
      <span className="sr-only">문의 검색</span>
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="고객명, 이메일, 제목 검색"
        className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
      />
    </label>
  );
}
