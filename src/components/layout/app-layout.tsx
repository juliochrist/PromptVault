"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/common/command-palette";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <CommandPalette />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 pb-20 lg:p-6 lg:pb-6",
            className,
          )}
        >
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
