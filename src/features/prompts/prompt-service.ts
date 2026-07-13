import { createClient } from "@/lib/supabase/client";
import type { Prompt, PromptVersion, PromptFormData } from "@/types/prompt";

export async function getPrompts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Prompt[];
}

export async function getPrompt(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Prompt;
}

export async function createPrompt(form: PromptFormData) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .insert({
      title: form.title,
      description: form.description || null,
      content: form.content,
      category: form.category || null,
    } as never)
    .select()
    .single();

  if (error) throw error;

  const created = data as unknown as { id: string };

  // Create initial version
  await supabase.from("prompt_versions").insert({
    prompt_id: created.id,
    title: form.title,
    content: form.content,
    description: form.description || null,
    version_number: 1,
    source: "manual",
  } as never);

  return data as Prompt;
}

export async function updatePrompt(id: string, form: PromptFormData) {
  const supabase = createClient();

  // Get current version count
  const { data: versions } = await supabase
    .from("prompt_versions")
    .select("version_number")
    .eq("prompt_id", id)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = ((versions as unknown as { version_number: number }[])?.[0]?.version_number ?? 0) + 1;

  const { data, error } = await supabase
    .from("prompts")
    .update({
      title: form.title,
      description: form.description || null,
      content: form.content,
      category: form.category || null,
    } as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  // Create new version
  await supabase.from("prompt_versions").insert({
    prompt_id: id,
    title: form.title,
    content: form.content,
    description: form.description || null,
    version_number: nextVersion,
    source: "manual",
  } as never);

  return data as Prompt;
}

export async function deletePrompt(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("prompts").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleFavorite(id: string, current: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .update({ is_favorite: !current } as never)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Prompt;
}

export async function getFavoritePrompts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("is_favorite", true)
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Prompt[];
}

export async function getPromptVersions(promptId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_versions")
    .select("*")
    .eq("prompt_id", promptId)
    .order("version_number", { ascending: false });

  if (error) throw error;
  return data as PromptVersion[];
}

export async function restoreVersion(promptId: string, version: PromptVersion) {
  const supabase = createClient();

  // Update prompt with version content
  const { data, error } = await supabase
    .from("prompts")
    .update({
      title: version.title,
      content: version.content,
      description: version.description,
    } as never)
    .eq("id", promptId)
    .select()
    .single();

  if (error) throw error;

  // Create a new version entry marking it as a restore
  const { data: versions } = await supabase
    .from("prompt_versions")
    .select("version_number")
    .eq("prompt_id", promptId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = ((versions as unknown as { version_number: number }[])?.[0]?.version_number ?? 0) + 1;

  await supabase.from("prompt_versions").insert({
    prompt_id: promptId,
    title: version.title,
    content: version.content,
    description: version.description,
    variables_json: version.variables_json,
    version_number: nextVersion,
    source: "restore",
    notes: `Restored from version ${version.version_number}`,
  } as never);

  return data as Prompt;
}
