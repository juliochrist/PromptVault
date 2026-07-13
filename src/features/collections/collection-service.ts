import { createClient } from "@/lib/supabase/client";
import type { Collection } from "@/types/prompt";

export async function getCollections() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []) as unknown as Collection[];
}

export async function createCollection(name: string, description?: string, color?: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("collections")
    .insert({ name, description: description || null, color: color || null } as never)
    .select()
    .single();

  if (error) throw error;
  return data as unknown as Collection;
}

export async function deleteCollection(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw error;
}

export async function getCollectionPrompts(collectionId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_collections")
    .select("prompt_id")
    .eq("collection_id", collectionId);

  if (error) throw error;
  return ((data ?? []) as { prompt_id: string }[]).map((d) => d.prompt_id);
}

export async function addPromptToCollection(promptId: string, collectionId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prompt_collections")
    .insert({ prompt_id: promptId, collection_id: collectionId } as never);

  if (error) throw error;
}

export async function removePromptFromCollection(promptId: string, collectionId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("prompt_collections")
    .delete()
    .eq("prompt_id", promptId)
    .eq("collection_id", collectionId);

  if (error) throw error;
}
