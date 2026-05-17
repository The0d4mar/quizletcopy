'use client'

import DeckCard from "@/components/ui/Card/DeckCard";
import {loadCards, loadDecks} from "@/storage";
import { Card, Deck } from "@/types/type";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { addNewDeck } from "@/api/localFunc";

await new Promise(resolve => setTimeout(resolve, 5000));

export default function Home() {
  const [decks, setDecks] = useState<Deck[]>(() => loadDecks());
  const [cards, setCards] = useState<Card[]>(() => loadCards());
  const router = useRouter();



  const addDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const id = addNewDeck(decks)
    
    router.push(`/deck/${id}/deckEdit/{state="createNewDeck"}`);
  };





  return (
    <section className="">
      
      <div className="flex mb-10">
        <button onClick = {e => addDeck(e)} className="border-1 rounded-xl flex justify-center items-center px-4 py-3">Добавить колоду</button>
      </div>
        
      <div className="mb-6 flex-col flex justify-start gap-3">
        {decks.map(deck => {
          const cardsCount = cards.filter(card => card.deckId === deck.id).length;

          return (
            <DeckCard key ={deck.id} deck={deck} cardsCount={cardsCount}/>
          );
        })}
      </div>


    </section>
  );
}
