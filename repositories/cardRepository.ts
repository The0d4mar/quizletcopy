import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export function findCardsByDeckId(deckId: string) {
  return prisma.card.findMany({
    where: { deckId },
    orderBy: { createdAt: "asc" },
  });
}

export function findCardWithEditableDeck(cardId: string, userId: string) {
  return prisma.card.findUnique({
    where: { id: cardId },
    include: {
      deck: {
        select: {
          ownerId: true,
          shares: { where: { userId, role: "EDITOR" }, select: { id: true } },
        },
      },
    },
  });
}

export function createCard(data: Prisma.CardUncheckedCreateInput) {
  return prisma.card.create({ data });
}

export function updateCard(cardId: string, data: Prisma.CardUpdateInput) {
  return prisma.card.update({
    where: { id: cardId },
    data,
  });
}

export function deleteCard(cardId: string) {
  return prisma.card.delete({
    where: { id: cardId },
  });
}