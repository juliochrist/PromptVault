import { createClient } from "@/lib/supabase/client";
import type { Prompt } from "@/types/prompt";

export async function searchPrompts(query: string) {
  const supabase = createClient();

  if (!query.trim()) {
    const { data, error } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_archived", false)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data as Prompt[];
  }

  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("is_archived", false)
    .textSearch("search_vector", query, {
      type: "websearch",
      config: "english",
    })
    .order("updated_at", { ascending: false })
    .limit(20);

  if (error) {
    // Fallback to ilike search if full-text search fails
    const q = `%${query}%`;
    const { data: fallback, error: fallbackError } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_archived", false)
      .or(`title.ilike.${q},description.ilike.${q},content.ilike.${q},category.ilike.${q}`)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (fallbackError) throw fallbackError;
    return fallback as Prompt[];
  }

  return data as Prompt[];
}
