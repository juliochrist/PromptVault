"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as promptService from "./prompt-service";
import type { PromptFormData } from "@/types/prompt";

const promptsKey = "prompts";
const promptKey = "prompt";

export function usePrompts() {
  return useQuery({
    queryKey: [promptsKey],
    queryFn: promptService.getPrompts,
  });
}

export function usePrompt(id: string) {
  return useQuery({
    queryKey: [promptKey, id],
    queryFn: () => promptService.getPrompt(id),
    enabled: !!id,
  });
}

export function useFavoritePrompts() {
  return useQuery({
    queryKey: [promptsKey, "favorites"],
    queryFn: promptService.getFavoritePrompts,
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: PromptFormData) => promptService.createPrompt(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [promptsKey] });
      toast.success("Prompt created");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: PromptFormData }) =>
      promptService.updatePrompt(id, form),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [promptsKey] });
      queryClient.invalidateQueries({ queryKey: [promptKey, data.id] });
      toast.success("Prompt updated");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promptService.deletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [promptsKey] });
      toast.success("Prompt deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, current }: { id: string; current: boolean }) =>
      promptService.toggleFavorite(id, current),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [promptsKey] });
    },
  });
}

export function usePromptVersions(promptId: string) {
  return useQuery({
    queryKey: ["prompt-versions", promptId],
    queryFn: () => promptService.getPromptVersions(promptId),
    enabled: !!promptId,
  });
}
