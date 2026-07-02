import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const folderInclude = {
  decks: { select: { id: true, title: true } },
} satisfies Prisma.FolderInclude;

export function findFoldersByOwner(ownerId: string) {
  return prisma.folder.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    include: folderInclude,
  });
}

export function findFolderOwner(folderId: string) {
  return prisma.folder.findUnique({
    where: { id: folderId },
    select: { ownerId: true },
  });
}

export function countReadableDecks(deckIds: string[], userId: string) {
  return prisma.deck.count({
    where: {
      id: { in: deckIds },
      OR: [{ ownerId: userId }, { isPublic: true }, { shares: { some: { userId } } }],
    },
  });
}

export function createFolder(data: Prisma.FolderUncheckedCreateInput, deckIds: string[]) {
  return prisma.folder.create({
    data: {
      ...data,
      decks: { connect: deckIds.map((id) => ({ id })) },
    },
    include: folderInclude,
  });
}

export function updateFolder(folderId: string, data: Prisma.FolderUpdateInput) {
  return prisma.folder.update({
    where: { id: folderId },
    data,
    include: folderInclude,
  });
}

export function deleteFolder(folderId: string) {
  return prisma.folder.delete({
    where: { id: folderId },
  });
}