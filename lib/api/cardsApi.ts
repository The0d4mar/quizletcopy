import type { Card, Deck } from "@/types/types.type";

type ApiCard = Card;

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "Card API request failed";

    throw new Error(message);
  }

  return payload as T;
}

function hasChanged(previous: Card | undefined, current: Card) {
  return (
    !previous ||
    previous.deckId !== current.deckId ||
    previous.original !== current.original ||
    previous.translation !== current.translation
  );
}

export async function getDeckCards(deckId: string): Promise<Card[]> {
  const response = await fetch(`/api/decks/${deckId}/cards`, { cache: "no-store" });
  const payload = await readJson<{ cards: ApiCard[] }>(response);

  return payload.cards;
}

export async function getCards(decks: Deck[]): Promise<Card[]> {
  const result = await Promise.all(decks.map((deck) => getDeckCards(deck.id)));

  return result.flat();
}

export async function createCard(card: Card): Promise<Card> {
  const response = await fetch(`/api/decks/${card.deckId}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: card.id,
      original: card.original,
      translation: card.translation,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    }),
  });
  const payload = await readJson<{ card: ApiCard }>(response);

  return payload.card;
}

export async function updateCard(card: Card): Promise<Card> {
  const response = await fetch(`/api/cards/${card.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      original: card.original,
      translation: card.translation,
    }),
  });
  const payload = await readJson<{ card: ApiCard }>(response);

  return payload.card;
}

export async function deleteCard(cardId: string): Promise<void> {
  const response = await fetch(`/api/cards/${cardId}`, { method: "DELETE" });
  await readJson<{ ok: boolean }>(response);
}

export async function persistCardsToApi(cards: Card[], previousCards: Card[] = []) {
  const previousById = new Map(previousCards.map((card) => [card.id, card]));
  const currentIds = new Set(cards.map((card) => card.id));

  await Promise.all(
    previousCards
      .filter((card) => !currentIds.has(card.id))
      .map((card) => deleteCard(card.id).catch(() => undefined)),
  );

  await Promise.all(
    cards
      .filter((card) => card.original.trim() && card.translation.trim())
      .filter((card) => hasChanged(previousById.get(card.id), card))
      .map(async (card) => {
        try {
          await updateCard(card);
        } catch {
          await createCard(card).catch(() => undefined);
        }
      }),
  );
}

export const fetchCardsFromApi = getCards;