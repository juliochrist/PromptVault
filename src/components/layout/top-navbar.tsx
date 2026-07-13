"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Command, Sparkles } from "lucide-react";

export function TopNavbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/60 backdrop-blur-xl px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-command-palette"));
          }}
          className="flex items-center gap-2 rounded-[14px] border border-border bg-glass px-3.5 py-2 text-sm text-text-secondary transition-all duration-150 hover:border-border-hover hover:text-text hover:shadow-dropdown"
        >
          <Command className="h-3.5 w-3.5" />
          <span>Search pages...</span>
          <kbd className="ml-6 rounded-[6px] border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted">
            ⌘K
          </kbd>
        </button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full glass-hover">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                <Sparkles className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings/theme")}>
            Theme
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-danger">
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
