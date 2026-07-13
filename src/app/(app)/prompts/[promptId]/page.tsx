"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Trash2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PromptForm } from "@/features/prompts/prompt-form";
import {
  usePrompt,
  useUpdatePrompt,
  useDeletePrompt,
  useToggleFavorite,
  usePromptVersions,
} from "@/features/prompts/use-prompts";
import type { PromptFormData } from "@/types/prompt";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const promptId = params.promptId as string;

  const { data: prompt, isLoading } = usePrompt(promptId);
  const { data: versions } = usePromptVersions(promptId);
  const updatePrompt = useUpdatePrompt();
  const deletePrompt = useDeletePrompt();
  const toggleFavorite = useToggleFavorite();

  const [editing, setEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-card" />
        <div className="h-32 animate-pulse rounded-xl bg-card" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted">Prompt not found</p>
        <Button variant="link" onClick={() => router.push("/prompts")}>
          Back to prompts
        </Button>
      </div>
    );
  }

  const handleUpdate = async (data: PromptFormData) => {
    await updatePrompt.mutateAsync({ id: promptId, form: data });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Delete this prompt? This cannot be undone.")) {
      await deletePrompt.mutateAsync(promptId);
      router.push("/prompts");
    }
  };

  const currentVersion = versions?.[0]?.version_number ?? 1;

  if (editing) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setEditing(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text">Edit Prompt</h1>
            <p className="text-sm text-muted">Version {currentVersion}</p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <PromptForm
              initialData={prompt}
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text">{prompt.title}</h1>
            <p className="text-sm text-muted">
              v{currentVersion} &middot;{" "}
              {new Date(prompt.updated_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite.mutate({ id: promptId, current: prompt.is_favorite })}
          >
            <Heart
              className={`h-4 w-4 ${
                prompt.is_favorite ? "fill-danger text-danger" : "text-muted"
              }`}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowHistory(!showHistory)}>
            <History className="h-4 w-4 text-muted" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </div>
      </div>

      {prompt.description && (
        <p className="text-muted">{prompt.description}</p>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted">
            Prompt Content
          </CardTitle>
          {prompt.category && <Badge variant="secondary">{prompt.category}</Badge>}
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap rounded-lg bg-card p-4 text-sm text-text font-mono border border-border">
            {prompt.content}
          </pre>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Button onClick={() => setEditing(true)}>Edit Prompt</Button>
      </div>

      {showHistory && versions && versions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {versions.map((v, i) => (
                <div key={v.id}>
                  {i > 0 && <Separator className="mb-3" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">
                        v{v.version_number}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(v.created_at).toLocaleString()}
                        {v.source === "restore" && v.notes && (
                          <> &middot; {v.notes}</>
                        )}
                        {v.source !== "manual" && v.source !== "restore" && (
                          <> &middot; via {v.source.replace("_", " ")}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
