"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { Sidebar } from "@/components/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const restoreMobileMenuFocus = () => {
    requestAnimationFrame(() => {
      document.getElementById("mobile-menu-trigger")?.focus();
    });
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopMediaQuery = window.matchMedia("(min-width: 768px)");
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        restoreMobileMenuFocus();
        return;
      }

      if (event.key === "Tab") {
        const mobileNavigation = document.getElementById("mobile-navigation");
        const focusableElements = mobileNavigation?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    desktopMediaQuery.addEventListener("change", handleDesktopChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      desktopMediaQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div
        id="desktop-navigation"
        className="hidden shrink-0 md:block"
        inert={mobileMenuOpen ? true : undefined}
      >
        <div className="fixed inset-y-0 left-0">
          <Sidebar collapsed={sidebarCollapsed} />
        </div>
        <div aria-hidden className={sidebarCollapsed ? "w-20" : "w-64"} />
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="모바일 관리자 메뉴"
        >
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={() => {
              closeMobileMenu();
              restoreMobileMenuFocus();
            }}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative h-full w-fit">
            <Sidebar
              mobile
              onClose={() => {
                closeMobileMenu();
                restoreMobileMenuFocus();
              }}
              onNavigate={() => {
                closeMobileMenu();
                restoreMobileMenuFocus();
              }}
            />
          </div>
        </div>
      )}

      <div
        className="flex min-w-0 flex-1 flex-col"
        inert={mobileMenuOpen ? true : undefined}
      >
        <AppHeader
          sidebarCollapsed={sidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          onToggleSidebar={() => setSidebarCollapsed((value) => !value)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
