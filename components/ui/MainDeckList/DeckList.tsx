"use client";

import { useCards } from "@/features/cards/useCards";
import { useDecks } from "@/features/decks/useDecks";
import { Folder } from "@/types/types.type";
import DeckCard from "../Card/DeckCard";

interface DeckListProps {
  currentFolder?: Folder;
  folderId?: string;
  searchValue?: string;
}

const DeckList = ({ currentFolder, folderId = "NaFolder", searchValue = "" }: DeckListProps) => {
  const decksQuery = useDecks();
  const decksList = decksQuery.data ?? [];
  const cardsQuery = useCards(decksList);
  const cardsList = cardsQuery.data ?? [];

  let filteredDecks = decksList;

  if (folderId !== "NaFolder") {
    const folderDecks = decksList.filter((deck) => currentFolder?.deckIds.includes(deck.id)) || [];

    filteredDecks = folderDecks.filter((deck) =>
      deck.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  const isLoading = decksQuery.isLoading && decksList.length === 0;

  if (isLoading) {
    return <p className="card text-[var(--colorTextMuted)]">Загружаем колоды...</p>;
  }

  return (
    <div className="mb-6 flex flex-col items-start gap-3">
      {decksQuery.error && (
        <p className="card text-[var(--colorTextMuted)]">
          Не удалось загрузить колоды. Проверь backend и подключение к базе данных.
        </p>
      )}

      {filteredDecks.length === 0 ? (
        <p className="card text-[var(--colorTextMuted)]">Колоды пока не созданы.</p>
      ) : (
        filteredDecks.map((deck) => {
          const cardsCount = cardsList.filter((card) => card.deckId === deck.id).length;

          return <DeckCard key={deck.id} deck={deck} cardsCount={cardsCount} />;
        })
      )}
    </div>
  );
};

export default DeckList;