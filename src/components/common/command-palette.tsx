"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Search,
  Play,
  Settings,
  Plus,
  Heart,
  Command as CommandIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const pages = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { id: "prompts", label: "Go to Prompts", icon: FileText, href: "/prompts" },
  { id: "new-prompt", label: "Create New Prompt", icon: Plus, href: "/prompts/new" },
  { id: "collections", label: "Go to Collections", icon: FolderOpen, href: "/collections" },
  { id: "search", label: "Search Prompts", icon: Search, href: "/search" },
  { id: "playground", label: "Open Playground", icon: Play, href: "/playground" },
  { id: "favorites", label: "Favorite Prompts", icon: Heart, href: "/prompts?favorites=true" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings/profile" },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const openEvent = () => setOpen(true);
    document.addEventListener("keydown", down);
    window.addEventListener("open-command-palette", openEvent);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("open-command-palette", openEvent);
    };
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      setOpen(false);
      const page = pages.find((p) => p.id === id);
      if (page) router.push(page.href);
    },
    [router],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[15%] translate-y-0 p-0 sm:rounded-2xl">
        <Command className="rounded-lg border border-border bg-popover" label="Command Menu">
          <div className="flex items-center border-b border-border px-3">
            <CommandIcon className="mr-2 h-4 w-4 shrink-0 text-muted" />
            <Command.Input
              placeholder="Search pages and actions..."
              className="flex h-12 w-full bg-transparent text-sm text-text outline-none placeholder:text-muted"
            />
          </div>
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted">
              No results found.
            </Command.Empty>
            <Command.Group heading="Navigation" className="text-xs text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
              {pages.map((page) => {
                const Icon = page.icon;
                return (
                  <Command.Item
                    key={page.id}
                    value={page.id}
                    onSelect={handleSelect}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-text hover:bg-card aria-selected:bg-card"
                  >
                    <Icon className="h-4 w-4 text-muted" />
                    {page.label}
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
          <div className="flex items-center gap-4 border-t border-border px-3 py-2">
            <div className="flex items-center gap-1 text-xs text-muted">
              <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">↑↓</kbd>
              <span>navigate</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">↵</kbd>
              <span>open</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <kbd className="rounded border border-border px-1 py-0.5 text-[10px]">esc</kbd>
              <span>close</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
