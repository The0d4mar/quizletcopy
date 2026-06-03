'use client';
import { loadCards, loadDecks } from "@/storage";
import { Card, Deck } from "@/types/type";
import DeckList from "@/components/ui/MainDeckList/DeckList";
import AddDeckBtn from "@/components/ui/AddDeckBtn/AddDeckBtn";

export default function Home() {
  const decks = loadDecks();
  const cards = loadCards();


  return (
    <section>
      <div className="flex mb-10">
        <AddDeckBtn decks={decks}/>
      </div>
      <DeckList decksList={decks} cardsList={cards} />
    </section>
  );
}