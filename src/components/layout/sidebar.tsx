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
  Sparkles,
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
    <aside className="hidden lg:flex m-3 mr-0 h-[calc(100vh-1.5rem)] w-60 flex-col rounded-sidebar glass">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-primary">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-text">PromptVault</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname.startsWith(route.href);
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-active text-primary"
                  : "text-text-secondary hover:bg-sidebar-hover hover:text-text",
              )}
            >
              <Icon className="h-4 w-4" />
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-4">
        <p className="text-xs text-muted">v0.1.0</p>
      </div>
    </aside>
  );
}
