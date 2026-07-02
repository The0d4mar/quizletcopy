import { ApiError } from "@/lib/api/errors";
import type { CreateCardInput, UpdateCardInput } from "@/lib/validation/cardSchemas";
import * as cardRepository from "@/repositories/cardRepository";
import * as deckRepository from "@/repositories/deckRepository";

export async function listCardsForDeck(deckId: string, userId?: string) {
  const deck = await deckRepository.findReadableDeck(deckId, userId);

  if (!deck) {
    throw new ApiError(404, "Deck not found");
  }

  return cardRepository.findCardsByDeckId(deckId);
}

export async function createCardForDeck(userId: string, deckId: string, data: CreateCardInput) {
  const deck = await deckRepository.findEditableDeck(deckId, userId);

  if (!deck) {
    throw new ApiError(404, "Deck not found");
  }

  return cardRepository.createCard({
    id: data.id,
    original: data.original,
    translation: data.translation,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    deckId,
  });
}

async function assertCanEditCard(cardId: string, userId: string) {
  const card = await cardRepository.findCardWithEditableDeck(cardId, userId);

  if (!card) {
    throw new ApiError(404, "Card not found");
  }

  if (card.deck.ownerId !== userId && card.deck.shares.length === 0) {
    throw new ApiError(403, "Only deck owner or editor can modify cards");
  }

  return card;
}

export async function updateCardForUser(userId: string, cardId: string, data: UpdateCardInput) {
  await assertCanEditCard(cardId, userId);

  return cardRepository.updateCard(cardId, {
    original: data.original,
    translation: data.translation,
  });
}

export async function deleteCardForUser(userId: string, cardId: string) {
  await assertCanEditCard(cardId, userId);
  await cardRepository.deleteCard(cardId);
}