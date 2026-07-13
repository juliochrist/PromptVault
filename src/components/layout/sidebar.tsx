"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  Search,
  Play,
} from "lucide-react";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Prompts", icon: FileText, href: "/prompts" },
  { label: "Collections", icon: FolderOpen, href: "/collections" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Playground", icon: Play, href: "/playground" },
  { label: "Settings", icon: Settings, href: "/settings/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border px-6">
        <div className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-lg font-bold text-text">PromptVault</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname.startsWith(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-muted hover:bg-card hover:text-text",
              )}
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-xs text-sidebar-muted">PromptVault v0.1.0</p>
      </div>
    </aside>
  );
}
