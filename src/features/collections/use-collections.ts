"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as collectionService from "./collection-service";

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: collectionService.getCollections,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, description, color }: { name: string; description?: string; color?: string }) =>
      collectionService.createCollection(name, description, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection created");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
