'use client'

import DeckCard from "@/components/ui/Card/DeckCard";
import { loadCards, loadDecks } from "@/storage";
import { Card, Deck } from "@/types/type";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { addNewDeck } from "@/api/localFunc";

export default function Home() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const router = useRouter();
  console.log(loadCards());

  useEffect(() => {
    setDecks(loadDecks());
    setCards(loadCards());
  }, []);

  const addDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const id = addNewDeck(decks);

    router.push(`/deck/${id}/deckEdit/state=createNewDeck`);
  };

  return (
    <section>
      <div className="flex mb-10">
        <button
          onClick={addDeck}
          className="border-1 rounded-[var(--radius-card)] flex justify-center items-center px-[var(--padding-x-card)] py-[var(--padding-y-card)]"
        >
          Добавить колоду
        </button>
      </div>

      <div className="mb-6 flex flex-col items-start gap-3">
        {decks.map(deck => {
          const cardsCount = cards.filter(card => card.deckId === deck.id).length;

          return (
            <DeckCard
              key={deck.id}
              deck={deck}
              cardsCount={cardsCount}
            />
          );
        })}
      </div>
    </section>
  );
}