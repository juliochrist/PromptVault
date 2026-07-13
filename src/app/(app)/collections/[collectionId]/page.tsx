"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/features/prompts/prompt-card";
import { EmptyState } from "@/components/common/empty-state";
import { usePrompts, useToggleFavorite, useDeletePrompt } from "@/features/prompts/use-prompts";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Collection } from "@/types/prompt";

async function getCollection(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Collection;
}

async function getCollectionPromptIds(collectionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_collections")
    .select("prompt_id")
    .eq("collection_id", collectionId);
  if (error) throw error;
  return (data as { prompt_id: string }[]).map((d) => d.prompt_id);
}

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collectionId = params.collectionId as string;

  const { data: collection } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => getCollection(collectionId),
  });

  const { data: promptIds } = useQuery({
    queryKey: ["collection-prompts", collectionId],
    queryFn: () => getCollectionPromptIds(collectionId),
  });

  const { data: allPrompts } = usePrompts();
  const toggleFavorite = useToggleFavorite();
  const deletePrompt = useDeletePrompt();

  const prompts = allPrompts?.filter((p) => promptIds?.includes(p.id)) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/collections")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-text">
            {collection?.name ?? "Collection"}
          </h1>
          <p className="text-sm text-muted">{prompts.length} prompts</p>
        </div>
      </div>

      {prompts.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="Collection is empty"
          description="Add prompts to this collection"
          action={
            <Button asChild>
              <Link href="/prompts">Browse Prompts</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
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
