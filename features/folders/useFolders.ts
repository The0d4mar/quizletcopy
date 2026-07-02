"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addDeckToFolder,
  createFolder,
  deleteFolder,
  getFolders,
  removeDeckFromFolder,
  updateFolder,
} from "@/lib/api/foldersApi";
import { queryKeys } from "@/lib/query/queryKeys";
import type { Folder } from "@/types/types.type";

export function useFolders() {
  return useQuery({
    queryKey: queryKeys.folders,
    queryFn: getFolders,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: (folder) => {
      queryClient.setQueryData<Folder[]>(queryKeys.folders, (current = []) => [...current, folder]);
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFolder,
    onSuccess: (folder) => {
      queryClient.setQueryData<Folder[]>(queryKeys.folders, (current = []) =>
        current.map((item) => (item.id === folder.id ? folder : item)),
      );
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: (_result, folderId) => {
      queryClient.setQueryData<Folder[]>(queryKeys.folders, (current = []) =>
        current.filter((folder) => folder.id !== folderId),
      );
    },
  });
}

export function useAddDeckToFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, deckId }: { folderId: string; deckId: string }) => addDeckToFolder(folderId, deckId),
    onSuccess: (folder) => {
      queryClient.setQueryData<Folder[]>(queryKeys.folders, (current = []) =>
        current.map((item) => (item.id === folder.id ? folder : item)),
      );
    },
  });
}

export function useRemoveDeckFromFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ folderId, deckId }: { folderId: string; deckId: string }) => removeDeckFromFolder(folderId, deckId),
    onSuccess: (folder) => {
      queryClient.setQueryData<Folder[]>(queryKeys.folders, (current = []) =>
        current.map((item) => (item.id === folder.id ? folder : item)),
      );
    },
  });
}