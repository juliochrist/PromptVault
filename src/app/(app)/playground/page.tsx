"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/common/copy-button";
import { extractVariables, replaceVariables } from "@/utils/variables";
import { AIActions } from "@/features/ai/ai-actions";
import { useAIAction } from "@/features/ai/use-ai";
import { Sparkles, Eye } from "lucide-react";

export default function PlaygroundPage() {
  const [content, setContent] = useState("");
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const ai = useAIAction();

  const promptVariables = useMemo(
    () => extractVariables(content),
    [content],
  );

  const preview = useMemo(
    () => replaceVariables(content, varValues),
    [content, varValues],
  );

  const handleAIAction = async (action: string) => {
    if (!content.trim()) return;
    const result = await ai.execute(action as any, content);
    if (result) {
      setContent(result);
      setVarValues({});
    }
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] gap-4">
      {/* Left — Editor */}
      <div className="flex w-1/2 flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted" />
            <h2 className="text-sm font-medium text-text">Editor</h2>
          </div>
          {content.trim() && (
            <AIActions onAction={handleAIAction} loading={ai.loading} />
          )}
        </div>

        {ai.loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Processing...
          </div>
        )}

        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write or paste your prompt here..."
            className="h-full min-h-[400px] resize-none font-mono text-sm"
          />
        </div>

        {promptVariables.length > 0 && (
          <div className="space-y-3 rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-text">
              Variables ({promptVariables.length})
            </p>
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
      </div>

      {/* Right — Preview */}
      <div className="flex w-1/2 flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium text-text">Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={preview} label="Copy" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setContent("");
                setVarValues({});
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        <Card className="flex-1">
          <div className="h-full overflow-auto p-4">
            {content ? (
              <pre className="whitespace-pre-wrap font-mono text-sm text-text">
                {preview}
              </pre>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted">
                  Your prompt preview will appear here
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
