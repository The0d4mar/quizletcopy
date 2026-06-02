'use client'

import { loadCards, loadDecks, saveCards } from '@/storage';
import { Card } from '@/types/type';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WordCard } from '@/components/ui/Card/WordCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import DropDownDeckMenu from '@/components/ui/DropDownDeck/DropDownDeckMenu';
import ConnectDecksModal from '@/components/ui/ConnectDecks/ConnectDecksModal';

export default function Page() {
  const params = useParams<{ id: string }>();
  const sendedDeckId = params.id;

  const [cards, setCards] = useState<Card[]>([]);
  const [newWord, setNewWord] = useState<[string, string]>(['', '']);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refreshCards = () => {
    setCards(loadCards());
  };

  const deckTitle = loadDecks().find(deck => deck.id === sendedDeckId);

  useEffect(() => {
    const startedCards = loadCards();
    setCards(startedCards);
  }, []);

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
              original={currentCard.original}
              translation={currentCard.translation}
              flipped={false}
            />

            <div className='text-center flex items-center justify-center gap-4 mt-4'>
              <button
                onClick={goToPrevCard}
                disabled={isFirstCard}
                className='border-1 border-[var(--color-border)] rounded-[50%] w-8 h-8 flex items-center justify-center'
              >
                <ArrowLeft size={24}/>
              </button>

              <span>
                {currentIndex + 1} / {deckCards.length}
              </span>

              <button
                onClick={goToNextCard}
                disabled={isLastCard}
                className='border-1 border-[var(--color-border)] rounded-[50%] w-8 h-8 items-center justify-center'
              >
                <ArrowRight size={24}/>
              </button>
            </div>

            <div
              style={{
                width: '100%',
                height: '8px',
                background: '#ddd',
                borderRadius: '999px',
                overflow: 'hidden',
                marginTop: '16px',
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: '#4f46e5',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            <p>
              Просмотрено: {currentIndex + 1} из {deckCards.length}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}