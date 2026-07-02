import { Prisma, StudyGroupMemberStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const deckInclude = {
  owner: { select: { id: true, name: true, email: true } },
  _count: { select: { cards: true } },
} satisfies Prisma.DeckInclude;

export type DeckWithCount = Prisma.DeckGetPayload<{
  include: typeof deckInclude;
}>;

export function findDecks(where: Prisma.DeckWhereInput) {
  return prisma.deck.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: deckInclude,
  });
}

export function findDeckById(id: string) {
  return prisma.deck.findUnique({
    where: { id },
    include: deckInclude,
  });
}

export function findReadableDeck(id: string, userId?: string) {
  return prisma.deck.findFirst({
    where: {
      id,
      OR: [{ isPublic: true }, ...(userId ? [{ ownerId: userId }, { shares: { some: { userId } } }, { studyGroup: { members: { some: { userId, status: StudyGroupMemberStatus.APPROVED } } } }] : [])],
    },
    include: deckInclude,
  });
}


export function findEditableDeck(id: string, userId: string) {
  return prisma.deck.findFirst({
    where: {
      id,
      OR: [{ ownerId: userId }, { shares: { some: { userId, role: "EDITOR" } } }],
    },
    include: deckInclude,
  });
}
export function createDeck(data: Prisma.DeckUncheckedCreateInput) {
  return prisma.deck.create({
    data,
    include: deckInclude,
  });
}

export function updateDeck(id: string, data: Prisma.DeckUpdateInput) {
  return prisma.deck.update({
    where: { id },
    data,
    include: deckInclude,
  });
}

export function deleteDeck(id: string) {
  return prisma.deck.delete({
    where: { id },
  });
}
