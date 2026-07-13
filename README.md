# PromptVault

Organize, version, improve, and reuse AI prompts.

Built with Next.js 15, TypeScript, Tailwind CSS v4, Supabase, and TanStack Query.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui + Radix primitives |
| State | TanStack Query |
| Database | Supabase |
| Auth | Supabase Auth |
| AI | OpenAI (GPT-4o-mini) |
| Animation | Framer Motion |

## Features

- **Prompt CRUD** — Create, edit, delete prompts with categories and tags
- **Collections** — Group prompts into custom collections
- **Version History** — Every edit creates a version; restore any previous version
- **Variables** — `{{placeholder}}` replacement system with live preview
- **Search** — Full-text search across title, content, and categories
- **Favorites** — Pin your most-used prompts
- **AI Actions** — Improve, explain, summarise, translate, score, and generate better versions
- **Playground** — Split editor/preview with variable replacement
- **Command Palette** — Ctrl+K to navigate anywhere
- **Responsive** — Mobile bottom nav, adaptive layouts

## Getting Started

```bash
npm install
cp .env.local.example .env.local  # fill in your Supabase credentials
npm run dev
```

## Database

Run `supabase/schema.sql` in your Supabase SQL editor to create the required tables, indexes, and RLS policies.

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `OPENAI_API_KEY` | (optional) OpenAI key for AI features |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin |

## Deploy

Deploy to Vercel with zero configuration:

```bash
vercel
```
