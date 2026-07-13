"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Trash2,
  History,
  Variable,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PromptForm } from "@/features/prompts/prompt-form";
import { CopyButton } from "@/components/common/copy-button";
import {
  usePrompt,
  useUpdatePrompt,
  useDeletePrompt,
  useToggleFavorite,
  usePromptVersions,
} from "@/features/prompts/use-prompts";
import {
  extractVariables,
  replaceVariables,
  hasVariables,
} from "@/utils/variables";
import { AIActions } from "@/features/ai/ai-actions";
import { AIScoreCard } from "@/features/ai/ai-score-card";
import { useAIAction } from "@/features/ai/use-ai";
import type { PromptFormData } from "@/types/prompt";
import type { AIScore } from "@/services/ai/provider";
import { toast } from "sonner";

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
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  const ai = useAIAction();
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiScore, setAiScore] = useState<AIScore | null>(null);
  const [showAiResult, setShowAiResult] = useState(false);

  const promptVariables = useMemo(
    () => (prompt ? extractVariables(prompt.content) : []),
    [prompt?.content],
  );

  const replacedContent = useMemo(
    () => (prompt ? replaceVariables(prompt.content, varValues) : ""),
    [prompt?.content, varValues],
  );

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

  const handleAIAction = async (action: string) => {
    // Handle translate specially (prompt for language)
    if (action === "translate") {
      const lang = window.prompt("Target language (e.g. Spanish, French):");
      if (!lang) return;
      const result = await ai.execute("summarise", prompt.content);
      setAiResult(result);
      setShowAiResult(true);
      return;
    }

    if (action === "score") {
      const result = await ai.execute("score", prompt.content);
      if (result) {
        try {
          setAiScore(JSON.parse(result));
        } catch {
          setAiResult(result);
        }
      }
      setShowAiResult(true);
      return;
    }

    const result = await ai.execute(action as any, prompt.content);
    setAiResult(result);
    setShowAiResult(true);
  };

  const handleSaveAiResultAsVersion = async () => {
    if (!aiResult) return;
    const { createPrompt } = await import("@/features/prompts/prompt-service");
    // Save as new version on the current prompt
    await updatePrompt.mutateAsync({
      id: promptId,
      form: {
        title: prompt.title,
        description: prompt.description ?? "",
        content: aiResult,
        category: prompt.category ?? "",
      },
    });
    setShowAiResult(false);
    setAiResult(null);
  };

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

  const handleRestore = async (version: any) => {
    const { restoreVersion } = await import("@/features/prompts/prompt-service");
    await restoreVersion(promptId, version);
    toast.success(`Restored to version ${version.version_number}`);
    setShowHistory(false);
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
      {/* Header */}
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
            onClick={() =>
              toggleFavorite.mutate({ id: promptId, current: prompt.is_favorite })
            }
          >
            <Heart
              className={`h-4 w-4 ${
                prompt.is_favorite ? "fill-danger text-danger" : "text-muted"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 text-muted" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </div>
      </div>

      {prompt.description && <p className="text-muted">{prompt.description}</p>}

      {/* Prompt Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted">
            Prompt Content
          </CardTitle>
          <div className="flex items-center gap-2">
            {prompt.category && <Badge variant="secondary">{prompt.category}</Badge>}
            <CopyButton text={replacedContent} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {promptVariables.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Variable className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-text">Variables</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {promptVariables.map((v) => (
                  <div key={v} className="space-y-1">
                    <Label className="text-xs text-muted">{v}</Label>
                    <Input
                      placeholder={`Enter ${v}...`}
                      value={varValues[v] ?? ""}
                      onChange={(e) =>
                        setVarValues((prev) => ({ ...prev, [v]: e.target.value }))
                      }
                      className="h-9 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <pre className="whitespace-pre-wrap rounded-lg border border-border bg-card p-4 text-sm font-mono text-text">
            {replacedContent}
          </pre>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Button onClick={() => setEditing(true)}>Edit Prompt</Button>
      </div>

      {/* AI Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">AI Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AIActions
            onAction={handleAIAction}
            loading={ai.loading}
          />

          {ai.loading && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Processing...
            </div>
          )}

          {showAiResult && !ai.loading && (
            <div className="space-y-3">
              {aiScore ? (
                <AIScoreCard score={aiScore} />
              ) : aiResult ? (
                <>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <pre className="whitespace-pre-wrap text-sm text-text font-mono">
                      {aiResult}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <CopyButton text={aiResult} label="Copy Result" />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleSaveAiResultAsVersion}
                    >
                      Save as New Version
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAiResult(false);
                        setAiResult(null);
                        ai.reset();
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version History */}
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
                        {i === 0 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            current
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(v.created_at).toLocaleString()}
                        {v.source !== "manual" && (
                          <> &middot; {v.source.replace("_", " ")}</>
                        )}
                        {v.notes && <> &middot; {v.notes}</>}
                      </p>
                    </div>
                    {i > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore(v)}
                      >
                        Restore
                      </Button>
                    )}
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
