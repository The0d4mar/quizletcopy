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

const labels = {
  loading: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043a\u043e\u043b\u043e\u0434\u044b...",
  error: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043a\u043e\u043b\u043e\u0434\u044b. \u041f\u0440\u043e\u0432\u0435\u0440\u044c backend \u0438 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u0435 \u043a \u0431\u0430\u0437\u0435 \u0434\u0430\u043d\u043d\u044b\u0445.",
  empty: "\u041a\u043e\u043b\u043e\u0434\u044b \u043f\u043e\u043a\u0430 \u043d\u0435 \u0441\u043e\u0437\u0434\u0430\u043d\u044b.",
};

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
    return <p className="card mutedText">{labels.loading}</p>;
  }

  return (
    <div className="cardList">
      {decksQuery.error && <p className="card mutedText">{labels.error}</p>}

      {filteredDecks.length === 0 ? (
        <p className="card mutedText">{labels.empty}</p>
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