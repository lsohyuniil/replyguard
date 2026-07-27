import { ThemeToggle } from "@/components/theme-toggle";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
} from "@/components/icons";

type AppHeaderProps = {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  onToggleSidebar: () => void;
  onOpenMobileMenu: () => void;
};

export function AppHeader({
  sidebarCollapsed,
  mobileMenuOpen,
  onToggleSidebar,
  onOpenMobileMenu,
}: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <button
          id="mobile-menu-trigger"
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="메뉴 열기"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
        >
          <MenuIcon className="size-5" />
        </button>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
          aria-expanded={!sidebarCollapsed}
          aria-controls="desktop-navigation"
          className="hidden size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:inline-flex"
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon className="size-5" />
          ) : (
            <ChevronLeftIcon className="size-5" />
          )}
        </button>
      </div>
      <ThemeToggle />
    </header>
  );
}
