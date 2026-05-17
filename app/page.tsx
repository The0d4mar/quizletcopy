'use client'

import DeckCard from "@/components/ui/Card/DeckCard";
import {loadCards, loadDecks} from "@/storage";
import { Card, Deck } from "@/types/type";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { addNewDeck } from "@/api/localFunc";



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
    const id = addNewDeck(decks)
    
    router.push(`/deck/${id}/deckEdit/{state="createNewDeck"}`);
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
