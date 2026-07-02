"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteProgress, getProgress, resetDeckProgress, updateProgress } from "@/lib/api/progressApi";
import { queryKeys } from "@/lib/query/queryKeys";
import type { CardData } from "@/types/types.type";

export function useProgress() {
  return useQuery({
    queryKey: queryKeys.progress,
    queryFn: getProgress,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProgress,
    onSuccess: (progress) => {
      queryClient.setQueryData<CardData[]>(queryKeys.progress, (current = []) => {
        const exists = current.some((item) => item.cardId === progress.cardId);
        return exists
          ? current.map((item) => (item.cardId === progress.cardId ? progress : item))
          : [...current, progress];
      });
    },
  });
}

export function useDeleteProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProgress,
    onSuccess: (_result, cardId) => {
      queryClient.setQueryData<CardData[]>(queryKeys.progress, (current = []) =>
        current.filter((item) => item.cardId !== cardId),
      );
    },
  });
}

export function useResetDeckProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetDeckProgress,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.progress });
    },
  });
}