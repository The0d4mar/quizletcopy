'use client'

import ProgressBar from '@/components/ui/ProgressBar/ProgressBar';
import { WordCard } from '@/components/ui/Card/WordCard';
import { setCardData } from '@/store/cardDataStore';
import { RootState } from '@/store/store';
import { Card } from '@/types/type';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  shuffleArray,
  updateCardDataCorrect,
  updateCardDataWrong,
} from '../trainingUtils';
import FlashcardsToolbar from './FlashcardsToolbar';
import CardsController from '@/components/ui/CardsController/CardsController';
import TrainingResult, { TrainingMistake } from '../TrainingResult/TrainingResult';
import FlashcardsSettingsModal from '@/components/ui/FlashcardsSettingsModal/FlashcardsSettingsModal';
import { FlashcardFrontSide } from '@/types/type';
import { delConnectedCardData, resetDeckCardData } from '@/api/localFunc';

type SlideDirection = 'next' | 'prev';

interface FlashcardsModeProps {
  deckCards: Card[];
  deckTitle: string;
  onExit: () => void;
  deckId:string;
}

const FlashcardsMode = ({
  deckCards,
  deckTitle,
  onExit,
  deckId
}: FlashcardsModeProps) => {
  const dispatch = useDispatch();

  const cardData = useSelector(
    (state: RootState) => state.cardDataStore.cardData
  );

  const [orderedCards, setOrderedCards] = useState<Card[]>(deckCards);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('next');
  const [isAnimating, setIsAnimating] = useState(false);

  const [repeatTracking, setRepeatTracking] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [frontSide, setFrontSide] = useState<FlashcardFrontSide>('original');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [mistakes, setMistakes] = useState<TrainingMistake[]>([]);

  const currentCard = orderedCards[currentIndex];

  const previousCard =
    previousIndex !== null ? orderedCards[previousIndex] : null;

  const isFirstCard = currentIndex === 0;
  const isLastCard = currentIndex === orderedCards.length - 1;

  const progressPercent =
    orderedCards.length > 0
      ? ((currentIndex + 1) / orderedCards.length) * 100
      : 0;

  const getWordCardContent = (card: Card) => {
    if (frontSide === 'original') {
      return {
        original: card.original,
        translation: card.translation,
      };
    }

    return {
      original: card.translation,
      translation: card.original,
    };
  };

  const finishTraining = () => {
    if (!repeatTracking) {
      setCorrectCount(orderedCards.length);
      setWrongCount(0);
      setMistakes([]);
    }

    setIsFinished(true);
  };

  const goToPrevCard = () => {
    if (isFirstCard || isAnimating) return;

    setPreviousIndex(currentIndex);
    setSlideDirection('prev');
    setCurrentIndex(prev => prev - 1);
    setIsAnimating(true);
  };

  const goToNextCard = () => {
    if (isAnimating) return;

    if (isLastCard) {
      finishTraining();
      return;
    }

    setPreviousIndex(currentIndex);
    setSlideDirection('next');
    setCurrentIndex(prev => prev + 1);
    setIsAnimating(true);
  };

  const handleKnownCard = () => {
    if (!currentCard) return;

    const updatedCardData = updateCardDataCorrect(
      cardData,
      currentCard.id
    );

    dispatch(setCardData(updatedCardData));

    setCorrectCount(prev => prev + 1);

    goToNextCard();
  };

  const handleUnknownCard = () => {
    if (!currentCard) return;

    const updatedCardData = updateCardDataWrong(
      cardData,
      currentCard.id
    );

    dispatch(setCardData(updatedCardData));

    setWrongCount(prev => prev + 1);

    setMistakes(prev => [
      ...prev,
      {
        card: currentCard,
        selectedAnswer: 'Не знаю',
        correctAnswer:
          frontSide === 'original'
            ? currentCard.translation
            : currentCard.original,
      },
    ]);

    goToNextCard();
  };

  const handleSlideEnd = () => {
    setPreviousIndex(null);
    setIsAnimating(false);
  };

  const toggleShuffle = () => {
    setShuffled(prev => !prev);

    setOrderedCards(prevCards => {
      const viewedCards = prevCards.slice(0, currentIndex + 1);
      const notViewedCards = prevCards.slice(currentIndex + 1);

      return [
        ...viewedCards,
        ...shuffleArray(notViewedCards),
      ];
    });
  };

  const resetProgress = () => {
    setOrderedCards(shuffled ? shuffleArray(deckCards) : deckCards);
    setCurrentIndex(0);
    setPreviousIndex(null);
    setSlideDirection('next');
    setIsAnimating(false);
    setIsFinished(false);
    setCorrectCount(0);
    setWrongCount(0);
    setMistakes([]);
    setSettingsOpen(false);
  };

  const cleanLearningProgress = () =>{
    const deckCardsIds = deckCards.map(card => card.id);

    const updatedCardData = resetDeckCardData(
      cardData,
      deckCardsIds
    );

    dispatch(setCardData(updatedCardData));
  }

  const restartTraining = () => {
    resetProgress();
  };

  if (isFinished) {
    return (
      <TrainingResult
        deckTitle={deckTitle}
        correctCount={correctCount}
        wrongCount={wrongCount}
        mistakes={mistakes}
        onRestart={restartTraining}
        onExit={onExit}
        pageFlag={true}
      />
    );
  }

  const currentCardContent = currentCard
    ? getWordCardContent(currentCard)
    : null;

  const previousCardContent = previousCard
    ? getWordCardContent(previousCard)
    : null;

  return (
    <div className="flex justify-center">
      {settingsOpen && (
        <FlashcardsSettingsModal
          frontSide={frontSide}
          onChangeFrontSide={setFrontSide}
          onResetProgress={resetProgress}
          onClose={() => setSettingsOpen(false)}
          onCleanCardsData = {cleanLearningProgress}
        />
      )}

      <div className="w-full max-w-[720px]">
        <FlashcardsToolbar
          repeatTracking={repeatTracking}
          shuffled={shuffled}
          onToggleRepeatTracking={() => setRepeatTracking(prev => !prev)}
          onToggleShuffle={toggleShuffle}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        <div className="word-card-slider">
          {previousCardContent && (
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
                original={previousCardContent.original}
                translation={previousCardContent.translation}
                flipped={false}
              />
            </div>
          )}

          {currentCardContent && (
            <div
              key={`${currentCard?.id}-${frontSide}`}
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
                original={currentCardContent.original}
                translation={currentCardContent.translation}
                flipped={false}
              />
            </div>
          )}
        </div>

        {repeatTracking ? (
          <div className="text-center flex items-center justify-center gap-4 mb-[var(--item-gap)] mt-[var(--item-gap)]">
            <button
              type="button"
              onClick={handleUnknownCard}
              disabled={isAnimating}
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
              disabled={isAnimating}
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
            isLastCard={false}
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