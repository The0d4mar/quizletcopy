export const queryKeys = {
  decks: ["decks"] as const,
  deck: (deckId: string) => ["decks", deckId] as const,
  cards: ["cards"] as const,
  deckCards: (deckId: string) => ["decks", deckId, "cards"] as const,
  folders: ["folders"] as const,
  progress: ["progress"] as const,
  publicDecks: ["publicDecks"] as const,
};