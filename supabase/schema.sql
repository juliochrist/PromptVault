-- ============================================
-- PromptVault — Database Schema
-- ============================================

-- Extensions
create extension if not exists "pgcrypto" with schema "extensions";

-- ============================================
-- USERS (extends Supabase Auth)
-- ============================================
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  display_name text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Auto-create public.user on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- PROMPTS
-- ============================================
create table if not exists public.prompts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  title       text not null,
  description text,
  content     text not null,
  category    text,
  is_favorite boolean not null default false,
  is_archived boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_prompts_user_id on public.prompts(user_id);
create index idx_prompts_category on public.prompts(category);
create index idx_prompts_created_at on public.prompts(created_at desc);
create index idx_prompts_favorite on public.prompts(user_id, is_favorite) where is_favorite = true;

-- Full-text search index
alter table public.prompts add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, ''))
  ) stored;

create index idx_prompts_search on public.prompts using gin(search_vector);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_prompts_updated_at
  before update on public.prompts
  for each row execute function public.update_updated_at();

-- ============================================
-- PROMPT VERSIONS
-- ============================================
create table if not exists public.prompt_versions (
  id              uuid primary key default gen_random_uuid(),
  prompt_id       uuid not null references public.prompts(id) on delete cascade,
  title           text not null,
  content         text not null,
  description     text,
  variables_json  jsonb,
  notes           text,
  version_number  integer not null,
  source          text default 'manual',   -- 'manual', 'ai_improve', 'ai_rewrite', etc.
  created_at      timestamptz not null default now(),
  unique(prompt_id, version_number)
);

create index idx_prompt_versions_prompt_id on public.prompt_versions(prompt_id);
create index idx_prompt_versions_created_at on public.prompt_versions(created_at desc);

-- ============================================
-- PROMPT VARIABLES
-- ============================================
create table if not exists public.prompt_variables (
  id            uuid primary key default gen_random_uuid(),
  prompt_id     uuid not null references public.prompts(id) on delete cascade,
  name          text not null,             -- e.g. "framework"
  default_value text,                      -- e.g. "Next.js"
  unique(prompt_id, name)
);

create index idx_prompt_variables_prompt_id on public.prompt_variables(prompt_id);

-- ============================================
-- COLLECTIONS
-- ============================================
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  name        text not null,
  description text,
  color       text,                        -- optional hex colour for UI badge
  created_at  timestamptz not null default now()
);

create index idx_collections_user_id on public.collections(user_id);

-- ============================================
-- PROMPT <> COLLECTIONS (junction)
-- ============================================
create table if not exists public.prompt_collections (
  prompt_id     uuid not null references public.prompts(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  primary key (prompt_id, collection_id)
);

create index idx_prompt_collections_collection_id on public.prompt_collections(collection_id);

-- ============================================
-- TAGS
-- ============================================
create table if not exists public.tags (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name    text not null,
  color   text,
  unique(user_id, name)
);

create index idx_tags_user_id on public.tags(user_id);

-- ============================================
-- PROMPT <> TAGS (junction)
-- ============================================
create table if not exists public.prompt_tags (
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  tag_id    uuid not null references public.tags(id) on delete cascade,
  primary key (prompt_id, tag_id)
);

create index idx_prompt_tags_tag_id on public.prompt_tags(tag_id);

-- ============================================
-- FAVORITES (canonical table, prompts.is_favorite is denormalised)
-- ============================================
create table if not exists public.favorites (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  prompt_id  uuid not null references public.prompts(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, prompt_id)
);

create index idx_favorites_user_id on public.favorites(user_id);

-- ============================================
-- ACTIVITIES (append-only event log)
-- ============================================
create table if not exists public.activities (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users(id) on delete cascade,
  action        text not null,            -- 'created_prompt', 'updated_prompt', 'restored_version', etc.
  resource_type text not null,            -- 'prompt', 'collection', 'version'
  resource_id   uuid,
  metadata      jsonb,                    -- extra context (title, version_number, etc.)
  created_at    timestamptz not null default now()
);

create index idx_activities_user_id on public.activities(user_id);
create index idx_activities_created_at on public.activities(created_at desc);

-- ============================================
-- SHARES (future — public prompt sharing)
-- ============================================
create table if not exists public.shares (
  id          uuid primary key default gen_random_uuid(),
  prompt_id   uuid not null references public.prompts(id) on delete cascade,
  user_id     uuid not null references public.users(id) on delete cascade,
  share_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  is_public   boolean not null default true,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index idx_shares_token on public.shares(share_token);
create index idx_shares_prompt_id on public.shares(prompt_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.users enable row level security;
alter table public.prompts enable row level security;
alter table public.prompt_versions enable row level security;
alter table public.prompt_variables enable row level security;
alter table public.collections enable row level security;
alter table public.prompt_collections enable row level security;
alter table public.tags enable row level security;
alter table public.prompt_tags enable row level security;
alter table public.favorites enable row level security;
alter table public.activities enable row level security;
alter table public.shares enable row level security;

-- Users: can read/update own row
create policy "users_self" on public.users
  for all using (id = auth.uid());

-- Prompts: CRUD own
create policy "prompts_own" on public.prompts
  for all using (user_id = auth.uid());

-- Versions: read own, insert own
create policy "versions_select" on public.prompt_versions
  for select using (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );
create policy "versions_insert" on public.prompt_versions
  for insert with check (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );

-- Variables: read/insert own
create policy "variables_select" on public.prompt_variables
  for select using (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );
create policy "variables_insert" on public.prompt_variables
  for insert with check (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );

-- Collections: CRUD own
create policy "collections_own" on public.collections
  for all using (user_id = auth.uid());

-- Junction tables: inherit from parent
create policy "prompt_collections_select" on public.prompt_collections
  for select using (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );
create policy "prompt_collections_insert" on public.prompt_collections
  for insert with check (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );
create policy "prompt_collections_delete" on public.prompt_collections
  for delete using (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );

-- Tags: CRUD own
create policy "tags_own" on public.tags
  for all using (user_id = auth.uid());

create policy "prompt_tags_select" on public.prompt_tags
  for select using (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );
create policy "prompt_tags_insert" on public.prompt_tags
  for insert with check (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );
create policy "prompt_tags_delete" on public.prompt_tags
  for delete using (
    prompt_id in (select id from public.prompts where user_id = auth.uid())
  );

-- Favorites: CRUD own
create policy "favorites_own" on public.favorites
  for all using (user_id = auth.uid());

-- Activities: read own, insert own
create policy "activities_select" on public.activities
  for select using (user_id = auth.uid());
create policy "activities_insert" on public.activities
  for insert with check (user_id = auth.uid());

-- Shares: owner full, public can read shared
create policy "shares_own" on public.shares
  for all using (user_id = auth.uid());

-- Public read for valid shares
create policy "shares_public_read" on public.shares
  for select using (
    is_public = true and (expires_at is null or expires_at > now())
  );
