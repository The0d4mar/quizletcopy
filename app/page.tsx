'use client'

import DeckCard from "@/components/ui/Card/DeckCard";
import { CARDS_KEY, loadCards, loadDecks, saveDecks, STORAGE_KEY } from "@/storage";
import { Card, Deck } from "@/types/type";
import Link from "next/link";
import { useEffect, useState } from "react";



export default function Home() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([])

  useEffect(()=>{
    const storedDeck = loadDecks();
    const storedCard = loadCards()
    setDecks(storedDeck);
    setCards(storedCard)
  }, []);


  const addDeck = (e: React.MouseEvent<HTMLButtonElement>, deckName: string) => {
    e.stopPropagation();
    e.preventDefault();
    if(deckName != ''){

      const newDeck: Deck = {
      id: crypto.randomUUID(),
      title: deckName,
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
    setDeckName('')
    }
  };

  const [deckName, setDeckName] = useState<string>('');

  const changeDeckName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeckName(e.target.value);
  };


  return (
    <section className="">
      
      <div>
        <input type="text"
         placeholder="Название колоды"
         id="deckName"
         className="border p-2 rounded mr-2"
         value={deckName}
         onChange={e => changeDeckName(e)}
        />
        <button onClick = {e => addDeck(e, deckName)}>Добавить колоду</button>
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
