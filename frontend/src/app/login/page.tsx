import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { LoginNoticeToast } from "@/components/auth/login-notice-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { getLoginNotice } from "@/lib/auth/login-notice";

export const metadata: Metadata = {
  title: "로그인",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    reason?: string | string[];
  }>;
}) {
  const notice = getLoginNotice((await searchParams).reason);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-10">
      {notice && <LoginNoticeToast message={notice} />}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-foreground">
          R
        </div>
        <p className="mt-6 text-sm font-semibold text-accent">REPLYGUARD</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          운영자 로그인
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          고객 문의 처리 대시보드에 접속하려면 운영자 계정으로 로그인해
          주세요.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
