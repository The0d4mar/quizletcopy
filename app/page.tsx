'use client'

import DeckCard from "@/components/ui/Card/DeckCard";
import { CARDS_KEY, loadCards, loadDecks, saveDecks, STORAGE_KEY } from "@/storage";
import { Card, Deck } from "@/types/type";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';



export default function Home() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([])
  const router = useRouter();


  useEffect(()=>{
    const storedDeck = loadDecks();
    const storedCard = loadCards()
    setDecks(storedDeck);
    setCards(storedCard)
  }, []);


  const addDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault();

  const collectionDecks = decks.filter(deck =>
    deck.title.startsWith('Новая коллекция')
  );

  const newDeckTitle =
    collectionDecks.length === 0
      ? 'Новая коллекция'
      : `Новая коллекция ${collectionDecks.length + 1}`;

    const id = crypto.randomUUID()
    const newDeck: Deck = {
      id: id,
      title: newDeckTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      public: false,
      createdBy: "User",
    };

    setDecks((prev) => {
      const updatedDecks = [...prev, newDeck];
      saveDecks(updatedDecks);
      return updatedDecks;
    });
    router.push(`/deck/${id}/deckEdit`);
  };





  return (
    <section className="">
      
      <div className="flex mb-10">
        <button onClick = {e => addDeck(e)} className="border-1 rounded-xl flex justify-center items-center px-4 py-3">Добавить колоду</button>
      </div>
        
      <h1>
        {decks.map(deck => {
          const cardsCount = cards.filter(card => card.deckId === deck.id).length;

          return (
            <DeckCard key ={deck.id} deck={deck} cardsCount={cardsCount}/>
          );
        })}
      </h1>


    </section>
  );
}
