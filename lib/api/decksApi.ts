import type { Card, Deck } from "@/types/types.type";

type ApiDeck = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  lastRepeat: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId?: string;
  owner?: { id: string; name: string | null; email: string };
};

type DecksResponse = { decks: ApiDeck[] };
type DeckResponse = { deck: ApiDeck };
type CardsResponse = { cards: Card[] };

export type CreateDeckPayload = Pick<Deck, "id" | "title" | "createdAt" | "updatedAt" | "createdBy" | "public" | "lastRepeat"> & {
  description?: string;
};

export type UpdateDeckPayload = Partial<Pick<Deck, "title" | "description" | "public" | "lastRepeat">> & {
  id: string;
};

function getDeckAuthor(deck: ApiDeck) {
  return deck.owner?.name || deck.owner?.email || deck.ownerId || "User";
}

function mapDeckFromApi(deck: ApiDeck): Deck {
  return {
    id: deck.id,
    title: deck.title,
    description: deck.description ?? undefined,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
    createdBy: getDeckAuthor(deck),
    ownerId: deck.owner?.id ?? deck.ownerId,
    public: deck.isPublic,
    lastRepeat: deck.lastRepeat ?? "",
    isStatsOpen: true,
  };
}

function mapDeckToApi(deck: CreateDeckPayload | UpdateDeckPayload) {
  return {
    id: "id" in deck ? deck.id : undefined,
    title: deck.title,
    description: deck.description ?? null,
    isPublic: deck.public,
    lastRepeat: deck.lastRepeat || null,
    createdAt: "createdAt" in deck ? deck.createdAt : undefined,
    updatedAt: "updatedAt" in deck ? deck.updatedAt : undefined,
  };
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "Deck API request failed";

    throw new Error(message);
  }

  return payload as T;
}

export async function getDecks(): Promise<Deck[]> {
  const response = await fetch("/api/decks", { cache: "no-store" });
  const payload = await readJson<DecksResponse>(response);

  return payload.decks.map(mapDeckFromApi);
}

export async function getDeckById(deckId: string): Promise<Deck> {
  const response = await fetch(`/api/decks/${deckId}`, { cache: "no-store" });
  const payload = await readJson<DeckResponse>(response);

  return mapDeckFromApi(payload.deck);
}

export async function createDeck(deck: CreateDeckPayload): Promise<Deck> {
  const response = await fetch("/api/decks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapDeckToApi(deck)),
  });
  const payload = await readJson<DeckResponse>(response);

  return mapDeckFromApi(payload.deck);
}

export async function updateDeck(deck: UpdateDeckPayload): Promise<Deck> {
  const response = await fetch(`/api/decks/${deck.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapDeckToApi(deck)),
  });
  const payload = await readJson<DeckResponse>(response);

  return mapDeckFromApi(payload.deck);
}

export async function deleteDeck(deckId: string): Promise<void> {
  const response = await fetch(`/api/decks/${deckId}`, { method: "DELETE" });
  await readJson<{ ok: boolean }>(response);
}

export async function getDeckCards(deckId: string): Promise<Card[]> {
  const response = await fetch(`/api/decks/${deckId}/cards`, { cache: "no-store" });
  const payload = await readJson<CardsResponse>(response);

  return payload.cards;
}