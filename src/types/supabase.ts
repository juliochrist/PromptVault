export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Minimal Database type for Supabase client generics.
// Individual queries use explicit type assertions for now.
export interface Database {
  public: {
    Tables: {
      users: Record<string, unknown>;
      prompts: Record<string, unknown>;
      prompt_versions: Record<string, unknown>;
      prompt_variables: Record<string, unknown>;
      collections: Record<string, unknown>;
      prompt_collections: Record<string, unknown>;
      tags: Record<string, unknown>;
      prompt_tags: Record<string, unknown>;
      favorites: Record<string, unknown>;
      activities: Record<string, unknown>;
      shares: Record<string, unknown>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
