'use client'

import { loadCards, loadDecks, saveCards } from '@/storage';
import { Card } from '@/types/type';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { WordCard } from '@/components/ui/Card/WordCard';
import Link from 'next/link';
import DropDownDeckMenu from '@/components/ui/DropDownDeck/DropDownDeckMenu';
import ConnectDecksModal from '@/components/ui/ConnectDecks/ConnectDecksModal';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import CardsController from '@/components/ui/CardsController/CardsController';

export default function Page() {
  const params = useParams<{ id: string }>();
  const sendedDeckId = params.id;

  const [cards, setCards] = useState<Card[]>(loadCards());
  const [currentIndex, setCurrentIndex] = useState(0);

  const refreshCards = () => {
    setCards(loadCards());
  };

  const deckTitle = loadDecks().find(deck => deck.id === sendedDeckId);
  

  const deckCards = cards.filter(card => card.deckId === sendedDeckId);
  const currentCard = deckCards[currentIndex];

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === deckCards.length - 1;

  const progressPercent =
    deckCards.length > 0 ? ((currentIndex + 1) / deckCards.length) * 100 : 0;

  const goToPrevCard = () => {
    if (isFirstCard) return;
    setCurrentIndex(prev => prev - 1);
  };

  const goToNextCard = () => {
    if (isLastCard) return;
    setCurrentIndex(prev => prev + 1);
  };

 

  return (
    <section className='relative flex-1 w-full'>
      <ConnectDecksModal
        sendedDeckId={sendedDeckId}
        onConnected={refreshCards}
      />
      <div className='flex justify-start mb-10'>
        <Link href={'/'}>На главную</Link>
      </div>
      <div className = 'flex items-center justify-between'>
        <h1 className='text-3xl bold'>{deckTitle?.title}</h1>
        <DropDownDeckMenu localId={sendedDeckId}/>
      </div>
      

      <div className='flex justify-center mt-15'>
        {deckCards.length === 0 ? (
          <p>В этой колоде пока нет карточек</p>
        ) : (
          <div>
            <WordCard
              key={currentCard.id}
              original={currentCard.original}
              translation={currentCard.translation}
              flipped={false}
            />

            <CardsController
              goToPrevCard={goToPrevCard}
              goToNextCard={goToNextCard}
              isFirstCard={isFirstCard}
              isLastCard={isLastCard}
              currentIndex={currentIndex}
              deckCardsLength={deckCards.length}
            />

            <ProgressBar progressPercent={progressPercent} currentIndex={currentIndex} deckCardsLength={deckCards.length} />

          </div>
        )}
      </div>
    </section>
  );
}