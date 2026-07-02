"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createDeck, deleteDeck, getDeckById, getDecks, updateDeck } from "@/lib/api/decksApi";
import { queryKeys } from "@/lib/query/queryKeys";
import type { Deck } from "@/types/types.type";

export function useDecks() {
  return useQuery({
    queryKey: queryKeys.decks,
    queryFn: getDecks,
  });
}

export function useDeck(deckId: string) {
  return useQuery({
    queryKey: queryKeys.deck(deckId),
    queryFn: () => getDeckById(deckId),
    enabled: Boolean(deckId),
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeck,
    onSuccess: (deck) => {
      queryClient.setQueryData<Deck[]>(queryKeys.decks, (current = []) => [...current, deck]);
      queryClient.setQueryData(queryKeys.deck(deck.id), deck);
    },
  });
}

export function useUpdateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDeck,
    onSuccess: (deck) => {
      queryClient.setQueryData<Deck[]>(queryKeys.decks, (current = []) =>
        current.map((item) => (item.id === deck.id ? deck : item)),
      );
      queryClient.setQueryData(queryKeys.deck(deck.id), deck);
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDeck,
    onSuccess: (_result, deckId) => {
      queryClient.setQueryData<Deck[]>(queryKeys.decks, (current = []) =>
        current.filter((deck) => deck.id !== deckId),
      );
      queryClient.removeQueries({ queryKey: queryKeys.deck(deckId) });
      queryClient.removeQueries({ queryKey: queryKeys.deckCards(deckId) });
    },
  });
}