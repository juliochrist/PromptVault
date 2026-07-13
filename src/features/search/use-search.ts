"use client";

import { useQuery } from "@tanstack/react-query";
import { searchPrompts } from "./search-service";
import { useDebounce } from "@/hooks/use-debounce";

export function useSearch(query: string) {
  const debounced = useDebounce(query, 300);

  return useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchPrompts(debounced),
    enabled: true,
  });
}
