"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PromptForm } from "@/features/prompts/prompt-form";
import { useCreatePrompt } from "@/features/prompts/use-prompts";
import type { PromptFormData } from "@/types/prompt";

export default function NewPromptPage() {
  const createPrompt = useCreatePrompt();

  const handleSubmit = async (data: PromptFormData) => {
    await createPrompt.mutateAsync(data);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">New Prompt</h1>
        <p className="text-sm text-muted">Create a new prompt</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Details</CardTitle>
          <CardDescription>
            Fill in the details for your prompt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PromptForm onSubmit={handleSubmit} submitLabel="Create Prompt" />
        </CardContent>
      </Card>
    </div>
  );
}
