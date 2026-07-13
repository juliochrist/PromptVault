"use client";

import Link from "next/link";
import { Plus, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromptCard } from "@/features/prompts/prompt-card";
import { EmptyState } from "@/components/common/empty-state";
import { usePrompts, useToggleFavorite, useDeletePrompt } from "@/features/prompts/use-prompts";
import { useState } from "react";

export default function PromptsPage() {
  const { data: prompts, isLoading } = usePrompts();
  const toggleFavorite = useToggleFavorite();
  const deletePrompt = useDeletePrompt();
  const [search, setSearch] = useState("");

  const filtered = prompts?.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Prompts</h1>
          <p className="text-sm text-muted">{filtered?.length ?? 0} prompts</p>
        </div>
        <Button asChild>
          <Link href="/prompts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search prompts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={search ? "No results found" : "No prompts yet"}
          description={
            search
              ? "Try a different search term"
              : "Create your first prompt to get started"
          }
          action={
            !search ? (
              <Button asChild>
                <Link href="/prompts/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Prompt
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onToggleFavorite={(id, current) =>
                toggleFavorite.mutate({ id, current })
              }
              onDelete={(id) => {
                if (confirm("Delete this prompt? This cannot be undone.")) {
                  deletePrompt.mutate(id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
