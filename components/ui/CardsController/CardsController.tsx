import { ArrowLeft, ArrowRight } from 'lucide-react';
import React from 'react';
import CardsControllerBtn from '../CardsControllerBtn/CardsControllerBtn';

interface CardsControllerProps {
    goToPrevCard: () => void;
    goToNextCard: () => void;
    isFirstCard: boolean;
    isLastCard: boolean;
    currentIndex: number;
    deckCardsLength: number;
}

const CardsController = ({ goToPrevCard, goToNextCard, isFirstCard, isLastCard, currentIndex, deckCardsLength }: CardsControllerProps) => {
  return (
    <div className='text-center flex items-center justify-center gap-4 mb-[var(--gapMd)] mt-[var(--gapMd)]'>
        
        <CardsControllerBtn
            onClick={goToPrevCard}
            disabled={isFirstCard}
            icon={<ArrowLeft size={24}/>}
        />


        <span>
        {currentIndex + 1} / {deckCardsLength}
        </span>

        <CardsControllerBtn
            onClick={goToNextCard}
            disabled={isLastCard}
            icon={<ArrowRight size={24}/>}
        />
    </div>
  );
};

export default CardsController;