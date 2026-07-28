import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { QueryProvider } from "@/components/query-provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <QueryProvider>
      <AppShell>{children}</AppShell>
    </QueryProvider>
  );
}
