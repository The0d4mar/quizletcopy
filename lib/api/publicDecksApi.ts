import type { Deck } from "@/types/types.type";

type ApiPublicDeck = {
  id: string;
  title: string;
  description: string | null;
  isPublic: boolean;
  lastRepeat: string | null;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: { id: string; name: string | null; email: string };
  _count: { cards: number };
};

export type PublicDeck = Deck & {
  authorName: string;
  authorEmail: string;
  cardsCount: number;
};

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : "Public deck request failed";

    throw new Error(message);
  }

  return payload as T;
}

function mapPublicDeck(deck: ApiPublicDeck): PublicDeck {
  return {
    id: deck.id,
    title: deck.title,
    description: deck.description ?? undefined,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
    createdBy: deck.ownerId,
    public: deck.isPublic,
    lastRepeat: deck.lastRepeat ?? "",
    authorName: deck.owner.name ?? deck.owner.email,
    authorEmail: deck.owner.email,
    cardsCount: deck._count.cards,
  };
}

export async function getPublicDecks(params: { query?: string; sort?: string } = {}) {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set("q", params.query);
  if (params.sort) searchParams.set("sort", params.sort);

  const response = await fetch(`/api/public/decks?${searchParams.toString()}`, { cache: "no-store" });
  const payload = await readJson<{ decks: ApiPublicDeck[] }>(response);

  return payload.decks.map(mapPublicDeck);
}

export async function copyPublicDeck(deckId: string) {
  const response = await fetch(`/api/public/decks/${deckId}/copy`, { method: "POST" });
  const payload = await readJson<{ deck: { id: string } }>(response);

  return payload.deck;
}

export async function exportDeck(deckId: string) {
  const response = await fetch(`/api/decks/${deckId}/export`, { cache: "no-store" });
  return readJson<unknown>(response);
}

export async function importDeck(data: unknown) {
  const response = await fetch("/api/decks/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return readJson<{ deck: { id: string } }>(response);
}