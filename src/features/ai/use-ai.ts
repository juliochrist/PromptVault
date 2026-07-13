"use client";

import { useState } from "react";
import { toast } from "sonner";

interface AIActionState {
  loading: boolean;
  result: string | null;
}

async function callAI(endpoint: string, body: Record<string, unknown>) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "AI request failed");
  }

  const data = await res.json();
  return data.result;
}

export function useAIAction() {
  const [state, setState] = useState<AIActionState>({
    loading: false,
    result: null,
  });

  const execute = async (
    action: "improve" | "explain" | "score" | "summarise" | "generateBetter",
    prompt: string,
  ) => {
    setState({ loading: true, result: null });

    try {
      const endpoint =
        action === "summarise" || action === "generateBetter"
          ? "/api/ai/action"
          : `/api/ai/${action}`;

      const body: Record<string, unknown> = { prompt };
      if (action === "summarise" || action === "generateBetter") {
        body.action = action;
      }

      const result = await callAI(endpoint, body);
      setState({ loading: false, result });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI request failed";
      toast.error(message);
      setState({ loading: false, result: null });
      return null;
    }
  };

  const reset = () => setState({ loading: false, result: null });

  return { ...state, execute, reset };
}
