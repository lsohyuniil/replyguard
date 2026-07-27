"use client";

import CloseIcon from "@mui/icons-material/CloseRounded";
import DashboardIcon from "@mui/icons-material/DashboardRounded";
import InboxIcon from "@mui/icons-material/InboxRounded";
import PolicyIcon from "@mui/icons-material/PolicyRounded";
import SettingsIcon from "@mui/icons-material/SettingsRounded";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof DashboardIcon;
};

const navigationItems: NavigationItem[] = [
  { label: "대시보드", href: "/", icon: DashboardIcon },
  { label: "문의함", href: "/inquiries", icon: InboxIcon },
  { label: "정책 관리", href: "/policies", icon: PolicyIcon },
  { label: "연동 및 자동화", href: "/settings", icon: SettingsIcon },
];

// 상세 페이지에서도 해당 상위 메뉴를 선택된 상태로 보여줌
function isActivePath(pathname: string, href: string) {
  return href === "/"
    ? pathname === href
    : pathname.startsWith(`${href}/`) || pathname === href;
}

export function Sidebar({
  collapsed = false,
  mobile = false,
  onNavigate,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const showLabels = mobile || !collapsed;

  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-sidebar text-sidebar-foreground ${
        mobile ? "w-72 shadow-2xl" : collapsed ? "w-20" : "w-64"
      } transition-[width] duration-200`}
    >
      <div
        className={`flex h-16 shrink-0 items-center border-b border-border px-4 ${
          showLabels ? "justify-between" : "justify-center"
        }`}
      >
        <Link
          href="/"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={showLabels ? undefined : "ReplyGuard 대시보드"}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
            R
          </span>
          {showLabels && (
            <span className="truncate text-base font-semibold tracking-tight">
              ReplyGuard
            </span>
          )}
        </Link>
        {mobile && (
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="메뉴 닫기"
            className="inline-flex size-10 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:bg-sidebar-hover hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <CloseIcon className="size-5" />
          </button>
        )}
      </div>

      <nav aria-label="관리자 메뉴" className="flex-1 p-3">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  aria-label={showLabels ? undefined : item.label}
                  title={showLabels ? undefined : item.label}
                  className={`flex h-11 items-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    showLabels ? "gap-3 px-3" : "justify-center"
                  } ${
                    active
                      ? "bg-sidebar-active text-accent-foreground"
                      : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground"
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  {showLabels && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
