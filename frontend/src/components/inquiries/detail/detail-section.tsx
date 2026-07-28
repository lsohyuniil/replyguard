import type { ReactNode } from "react";

type DetailSectionProps = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
};

export function DetailSection({
  title,
  description,
  icon,
  children,
}: DetailSectionProps) {
  return (
    <section
      className="rounded-2xl border border-border bg-surface"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-bold text-foreground">{title}</h2>
        </div>
        {description && (
          <div className="mt-1 text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
