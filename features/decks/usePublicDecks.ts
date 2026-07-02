"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { copyPublicDeck, getPublicDecks } from "@/lib/api/publicDecksApi";
import { queryKeys } from "@/lib/query/queryKeys";

export function usePublicDecks(params: { query?: string; sort?: string }) {
  return useQuery({
    queryKey: [...queryKeys.publicDecks, params.query ?? "", params.sort ?? "recent"] as const,
    queryFn: () => getPublicDecks(params),
  });
}

export function useCopyPublicDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: copyPublicDeck,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.decks });
    },
  });
}