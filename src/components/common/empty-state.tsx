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
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16",
        className,
      )}
    >
      <Icon className="mb-4 h-12 w-12 text-muted" />
      <h3 className="mb-1 text-lg font-semibold text-text">{title}</h3>
      <p className="mb-4 text-sm text-muted">{description}</p>
      {action}
    </div>
  );
}
