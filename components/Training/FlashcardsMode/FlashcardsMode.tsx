'use client'

import CardsController from '@/components/ui/CardsController/CardsController';
import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import { WordCard } from '@/components/ui/Card/WordCard';
import { setCardData } from '@/store/cardDataStore';
import { RootState } from '@/store/store';
import { Card } from '@/types/type';
import { Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { shuffleArray, updateCardDataCorrect } from '../trainingUtils';
import FlashcardsToolbar from './FlashcardsToolbar';

type SlideDirection = 'next' | 'prev';

interface FlashcardsModeProps {
  deckCards: Card[];
}

const FlashcardsMode = ({ deckCards }: FlashcardsModeProps) => {
  const dispatch = useDispatch();

  const cardData = useSelector(
    (state: RootState) => state.cardDataStore.cardData
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('next');
  const [isAnimating, setIsAnimating] = useState(false);

  const [repeatTracking, setRepeatTracking] = useState(false);
  const [shuffled, setShuffled] = useState(false);

  const orderedCards = useMemo(() => {
    return shuffled ? shuffleArray(deckCards) : deckCards;
  }, [deckCards, shuffled]);

  const currentCard = orderedCards[currentIndex];
  const previousCard =
    previousIndex !== null ? orderedCards[previousIndex] : null;

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === orderedCards.length - 1;

  const progressPercent =
    orderedCards.length > 0
      ? ((currentIndex + 1) / orderedCards.length) * 100
      : 0;

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

  const handleKnownCard = () => {
    if (!currentCard) return;

    const updatedCardData = updateCardDataCorrect(cardData, currentCard.id);
    dispatch(setCardData(updatedCardData));

    goToNextCard();
  };

  const handleUnknownCard = () => {
    goToNextCard();
  };

  const handleSlideEnd = () => {
    setPreviousIndex(null);
    setIsAnimating(false);
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[720px]">
        <FlashcardsToolbar
          repeatTracking={repeatTracking}
          shuffled={shuffled}
          onToggleRepeatTracking={() => setRepeatTracking(prev => !prev)}
          onToggleShuffle={() => {
            setShuffled(prev => !prev);
            setCurrentIndex(0);
          }}
        />

        <div className="word-card-slider">
          {previousCard && (
            <div
              className={`
                word-card-slide
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

        {repeatTracking ? (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleUnknownCard}
              disabled={isLastCard || isAnimating}
              className="custom-btn rounded-[var(--radius-button)] border-[var(--color-danger)] text-[var(--color-danger)]"
            >
              <X size={22} />
            </button>

            <span className="font-bold">
              {currentIndex + 1} / {orderedCards.length}
            </span>

            <button
              type="button"
              onClick={handleKnownCard}
              disabled={isLastCard || isAnimating}
              className="custom-btn rounded-[var(--radius-button)] border-[var(--color-success)] text-[var(--color-success)]"
            >
              <Check size={22} />
            </button>
          </div>
        ) : (
          <CardsController
            goToPrevCard={goToPrevCard}
            goToNextCard={goToNextCard}
            isFirstCard={isFirstCard || isAnimating}
            isLastCard={isLastCard || isAnimating}
            currentIndex={currentIndex}
            deckCardsLength={orderedCards.length}
          />
        )}

        <ProgressBar
          progressPercent={progressPercent}
          currentIndex={currentIndex}
          deckCardsLength={orderedCards.length}
        />
      </div>
    </div>
  );
};

export default FlashcardsMode;