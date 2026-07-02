"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createCard, deleteCard, getCards, getDeckCards, updateCard } from "@/lib/api/cardsApi";
import { queryKeys } from "@/lib/query/queryKeys";
import type { Card, Deck } from "@/types/types.type";

export function useCards(decks: Deck[] = []) {
  return useQuery({
    queryKey: [...queryKeys.cards, decks.map((deck) => deck.id).sort().join("|")] as const,
    queryFn: () => getCards(decks),
    enabled: decks.length > 0,
  });
}

export function useDeckCards(deckId: string) {
  return useQuery({
    queryKey: queryKeys.deckCards(deckId),
    queryFn: () => getDeckCards(deckId),
    enabled: Boolean(deckId),
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCard,
    onSuccess: (card) => {
      queryClient.setQueryData<Card[]>(queryKeys.deckCards(card.deckId), (current = []) => [...current, card]);
      void queryClient.invalidateQueries({ queryKey: queryKeys.cards });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCard,
    onSuccess: (card) => {
      queryClient.setQueryData<Card[]>(queryKeys.deckCards(card.deckId), (current = []) =>
        current.map((item) => (item.id === card.id ? card : item)),
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.cards });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCard,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.cards });
    },
  });
}