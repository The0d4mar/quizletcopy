'use client'

import { loadCards, loadDecks } from '@/storage';
import { Card } from '@/types/type';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { WordCard } from '@/components/ui/Card/WordCard';
import Link from 'next/link';
import DropDownDeckMenu from '@/components/ui/DropDownDeck/DropDownDeckMenu';
import ConnectDecksModal from '@/components/ui/ConnectDecks/ConnectDecksModal';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import CardsController from '@/components/ui/CardsController/CardsController';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { changeDeckLastRepeat } from '@/api/localFunc';

type SlideDirection = 'next' | 'prev';

export default function Page() {
  const params = useParams<{ id: string }>();
  const sendedDeckId = params.id;

  useEffect(() => {
    changeDeckLastRepeat(sendedDeckId);
  }, [sendedDeckId]);

  const [cards, setCards] = useState<Card[]>(
    useSelector((state: RootState) => state.cardStore.cards)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('next');
  const [isAnimating, setIsAnimating] = useState(false);

  const refreshCards = () => {
    setCards(loadCards());
  };

  const deckTitle = loadDecks().find(deck => deck.id === sendedDeckId);

  const deckCards = cards.filter(card => card.deckId === sendedDeckId);

  const currentCard = deckCards[currentIndex];
  const previousCard =
    previousIndex !== null ? deckCards[previousIndex] : null;

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === deckCards.length - 1;

  const progressPercent =
    deckCards.length > 0 ? ((currentIndex + 1) / deckCards.length) * 100 : 0;

  const goToPrevCard = () => {
    if (isFirstCard || isAnimating) return;

    setPreviousIndex(currentIndex);
    setSlideDirection('prev');
    setCurrentIndex(prev => prev - 1);
    setIsAnimating(true);
  };

  const goToNextCard = () => {
    if (isLastCard || isAnimating) return;

    setPreviousIndex(currentIndex);
    setSlideDirection('next');
    setCurrentIndex(prev => prev + 1);
    setIsAnimating(true);
  };

  const handleSlideEnd = () => {
    setPreviousIndex(null);
    setIsAnimating(false);
  };

  return (
    <section className="custom-main-section">
      <ConnectDecksModal
        sendedDeckId={sendedDeckId}
        onConnected={refreshCards}
      />

      <div className="mb-[var(--block-gap)] flex justify-start">
        <Link
          href="/"
          className="text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
        >
          На главную
        </Link>
      </div>

      <div className="mb-[var(--section-gap)] flex items-center justify-between">
        <h1 className="max-w-[520px] truncate text-[var(--color-base)] text-[24px] font-bold leading-[var(--line-height-tight)]">
          {deckTitle?.title}
        </h1>

        <DropDownDeckMenu localId={sendedDeckId} />
      </div>

      <div className="flex justify-center">
        {deckCards.length === 0 ? (
          <p className="app-card text-[var(--color-text-muted)]">
            В этой колоде пока нет карточек
          </p>
        ) : (
          <div className="w-full max-w-[720px] mb-[var(--item-gap)]">
            <div className="word-card-slider">
              {previousCard && (
                <div
                  className={`
                    word-card-slide
                    word-card-slide-exit
                    ${
                      slideDirection === 'next'
                        ? 'word-card-slide-exit-left'
                        : 'word-card-slide-exit-right'
                    }
                  `}
                >
                  <WordCard
                    original={previousCard.original}
                    translation={previousCard.translation}
                    flipped={false}
                  />
                </div>
              )}

              {currentCard && (
                <div
                  key={currentCard.id}
                  onAnimationEnd={handleSlideEnd}
                  className={`
                    word-card-slide
                    word-card-slide-enter
                    ${
                      slideDirection === 'next'
                        ? 'word-card-slide-enter-right'
                        : 'word-card-slide-enter-left'
                    }
                  `}
                >
                  <WordCard
                    original={currentCard.original}
                    translation={currentCard.translation}
                    flipped={false}
                  />
                </div>
              )}
            </div>

            <CardsController
              goToPrevCard={goToPrevCard}
              goToNextCard={goToNextCard}
              isFirstCard={isFirstCard || isAnimating}
              isLastCard={isLastCard || isAnimating}
              currentIndex={currentIndex}
              deckCardsLength={deckCards.length}
            />

            <ProgressBar
              progressPercent={progressPercent}
              currentIndex={currentIndex}
              deckCardsLength={deckCards.length}
            />
          </div>
        )}
      </div>
    </section>
  );
}