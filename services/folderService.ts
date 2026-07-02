import { ApiError } from "@/lib/api/errors";
import type { CreateFolderInput, UpdateFolderInput } from "@/lib/validation/folderSchemas";
import * as folderRepository from "@/repositories/folderRepository";

function uniqueIds(ids: string[] = []) {
  return [...new Set(ids)];
}

async function assertFolderOwner(folderId: string, userId: string, action: string) {
  const folder = await folderRepository.findFolderOwner(folderId);

  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  if (folder.ownerId !== userId) {
    throw new ApiError(403, `Only folder owner can ${action}`);
  }

  return folder;
}

async function assertDecksAreReadable(deckIds: string[], userId: string) {
  if (deckIds.length === 0) return;

  const readableDeckCount = await folderRepository.countReadableDecks(deckIds, userId);

  if (readableDeckCount !== deckIds.length) {
    throw new ApiError(400, "Some decks are not available for this folder");
  }
}

export function listFoldersForUser(userId: string) {
  return folderRepository.findFoldersByOwner(userId);
}

export async function createFolderForUser(userId: string, data: CreateFolderInput) {
  const deckIds = uniqueIds(data.deckIds);
  await assertDecksAreReadable(deckIds, userId);

  return folderRepository.createFolder(
    {
      id: data.id,
      title: data.title,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      ownerId: userId,
    },
    deckIds,
  );
}

export async function updateFolderForUser(userId: string, folderId: string, data: UpdateFolderInput) {
  await assertFolderOwner(folderId, userId, "update this folder");

  const deckIds = data.deckIds ? uniqueIds(data.deckIds) : undefined;

  if (deckIds) {
    await assertDecksAreReadable(deckIds, userId);
  }

  return folderRepository.updateFolder(folderId, {
    title: data.title,
    decks: deckIds ? { set: deckIds.map((deckId) => ({ id: deckId })) } : undefined,
  });
}

export async function deleteFolderForUser(userId: string, folderId: string) {
  await assertFolderOwner(folderId, userId, "delete this folder");
  await folderRepository.deleteFolder(folderId);
}

export async function addDeckToFolderForUser(userId: string, folderId: string, deckId: string) {
  await assertFolderOwner(folderId, userId, "add decks");
  await assertDecksAreReadable([deckId], userId);

  return folderRepository.updateFolder(folderId, {
    decks: { connect: { id: deckId } },
  });
}

export async function removeDeckFromFolderForUser(userId: string, folderId: string, deckId: string) {
  await assertFolderOwner(folderId, userId, "remove decks");

  return folderRepository.updateFolder(folderId, {
    decks: { disconnect: { id: deckId } },
  });
}