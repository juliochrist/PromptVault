"use client";

import { useState } from "react";
import { Search as SearchIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PromptCard } from "@/features/prompts/prompt-card";
import { EmptyState } from "@/components/common/empty-state";
import { useSearch } from "@/features/search/use-search";
import { useToggleFavorite, useDeletePrompt } from "@/features/prompts/use-prompts";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: results, isLoading } = useSearch(query);
  const toggleFavorite = useToggleFavorite();
  const deletePrompt = useDeletePrompt();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Search</h1>
        <p className="text-sm text-muted">
          Search across all your prompts
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder="Search by title, content, category, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
          autoFocus
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : !query ? (
        <EmptyState
          icon={SearchIcon}
          title="Search your prompts"
          description="Type above to search through your prompt library"
        />
      ) : results?.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No results found"
          description={`No prompts matching "${query}"`}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results?.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onToggleFavorite={(id, current) =>
                toggleFavorite.mutate({ id, current })
              }
              onDelete={(id) => {
                if (confirm("Delete this prompt?")) deletePrompt.mutate(id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
