import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border/60 py-20 px-6",
        className,
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[16px] bg-surface">
        <Icon className="h-6 w-6 text-text-secondary" />
      </div>
      <h3 className="mb-1.5 text-lg font-semibold text-text">{title}</h3>
      <p className="mb-5 max-w-sm text-center text-sm text-text-secondary">{description}</p>
      {action}
    </div>
  );
}
