import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { QueryProvider } from "@/components/query-provider";
import { SESSION_EXPIRED_LOGIN_URL } from "@/lib/auth/session-expiry";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims.sub) {
    redirect(SESSION_EXPIRED_LOGIN_URL);
  }

  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  );
}
