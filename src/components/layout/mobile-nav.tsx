"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Search,
  Play,
} from "lucide-react";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Prompts", icon: FileText, href: "/prompts" },
  { label: "Collections", icon: FolderOpen, href: "/collections" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Playground", icon: Play, href: "/playground" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 flex items-center gap-1 rounded-[16px] border border-border bg-glass backdrop-blur-xl px-2 py-2 shadow-dropdown lg:hidden">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = pathname.startsWith(route.href);
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 rounded-[10px] py-1.5 text-[10px] font-medium transition-all duration-150",
              isActive
                ? "bg-sidebar-active text-primary"
                : "text-text-secondary hover:text-text",
            )}
          >
            <Icon className="h-4 w-4" />
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
