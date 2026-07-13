export interface Prompt {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  content: string;
  category: string | null;
  is_favorite: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface PromptVersion {
  id: string;
  prompt_id: string;
  title: string;
  content: string;
  description: string | null;
  variables_json: Record<string, string>[] | null;
  notes: string | null;
  version_number: number;
  source: string;
  created_at: string;
}

export interface PromptVariable {
  id: string;
  prompt_id: string;
  name: string;
  default_value: string | null;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  color: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
}

export interface Activity {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface PromptFormData {
  title: string;
  description: string;
  content: string;
  category: string;
}
