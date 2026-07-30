"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  duration?: number;
  onDismiss?: () => void;
};

export function Toast({ message, duration = 5_000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) {
    return null;
  }

  function dismiss() {
    setVisible(false);
    onDismiss?.();
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-50 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground shadow-[var(--shadow-card)] sm:max-w-md"
    >
      <InfoOutlinedIcon
        aria-hidden="true"
        className="size-5 shrink-0 text-accent"
      />
      <p className="break-keep leading-5">{message}</p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="알림 닫기"
        className="-mr-1 rounded-md p-1 text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <CloseRoundedIcon aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
