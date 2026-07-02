import { ApiError } from "@/lib/api/errors";
import type { CreateDeckInput, UpdateDeckInput } from "@/lib/validation/deckSchemas";
import * as deckRepository from "@/repositories/deckRepository";

export function listDecksForUser(userId: string, scope?: string | null) {
  const where =
    scope === "public"
      ? { isPublic: true }
      : scope === "all"
        ? { OR: [{ ownerId: userId }, { isPublic: true }, { shares: { some: { userId } } }] }
        : { OR: [{ ownerId: userId }, { shares: { some: { userId } } }] };

  return deckRepository.findDecks(where);
}

export async function getDeckForRead(deckId: string, userId?: string) {
  const deck = await deckRepository.findReadableDeck(deckId, userId);

  if (!deck) {
    throw new ApiError(404, "Deck not found");
  }

  return deck;
}

export function createDeckForUser(userId: string, data: CreateDeckInput) {
  return deckRepository.createDeck({
    id: data.id,
    title: data.title,
    description: data.description ?? null,
    isPublic: data.isPublic ?? false,
    lastRepeat: data.lastRepeat ?? null,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    ownerId: userId,
  });
}

export async function updateDeckForUser(userId: string, deckId: string, data: UpdateDeckInput) {
  const deck = await deckRepository.findDeckById(deckId);

  if (!deck) {
    throw new ApiError(404, "Deck not found");
  }

  if (deck.ownerId !== userId) {
    throw new ApiError(403, "Only deck owner can update this deck");
  }

  return deckRepository.updateDeck(deckId, {
    title: data.title,
    description: data.description,
    isPublic: data.isPublic,
    lastRepeat: data.lastRepeat,
  });
}

export async function deleteDeckForUser(userId: string, deckId: string) {
  const deck = await deckRepository.findDeckById(deckId);

  if (!deck) {
    throw new ApiError(404, "Deck not found");
  }

  if (deck.ownerId !== userId) {
    throw new ApiError(403, "Only deck owner can delete this deck");
  }

  await deckRepository.deleteDeck(deckId);
}
