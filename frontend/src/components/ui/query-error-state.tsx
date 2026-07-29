import { getUserFacingErrorMessage } from "@/lib/api/error-message";

type QueryErrorStateProps = {
  title: string;
  error: unknown;
  onRetry: () => void;
  compact?: boolean;
};

export function QueryErrorState({
  title,
  error,
  onRetry,
  compact = false,
}: QueryErrorStateProps) {
  return (
    <div
      role="alert"
      className={
        compact
          ? "px-6 py-12 text-center"
          : "grid min-h-72 place-items-center px-6 text-center"
      }
    >
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {getUserFacingErrorMessage(error)}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

