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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-bg lg:hidden">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = pathname.startsWith(route.href);
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
              isActive
                ? "text-primary"
                : "text-muted hover:text-text",
            )}
          >
            <Icon className="h-5 w-5" />
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
