"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
    >
      <span suppressHydrationWarning>
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
