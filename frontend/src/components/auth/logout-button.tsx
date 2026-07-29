"use client";

import LogoutIcon from "@mui/icons-material/LogoutRounded";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type LogoutButtonProps = {
  showLabel: boolean;
};

export function LogoutButton({ showLabel }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await createBrowserSupabaseClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label={showLabel ? undefined : "로그아웃"}
      title={showLabel ? undefined : "로그아웃"}
      className={`flex h-11 w-full items-center rounded-lg text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground ${
        showLabel ? "gap-3 px-3" : "justify-center"
      }`}
    >
      <LogoutIcon className="size-5 shrink-0" />
      {showLabel && <span>로그아웃</span>}
    </button>
  );
}
