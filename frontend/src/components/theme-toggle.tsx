"use client";

import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="색상 테마 전환"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-sm transition-colors hover:bg-surface-hover"
    >
      {isDark ? (
        <DarkModeIcon aria-hidden="true" className="size-5" />
      ) : (
        <LightModeIcon aria-hidden="true" className="size-5" />
      )}
    </button>
  );
}
