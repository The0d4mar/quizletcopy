import { Card, Deck } from '@/types/type';
import React from 'react';
import {FC} from 'react';
import DeckCard from '../Card/DeckCard';

interface DeckListProps {
    decksList: Deck[];
    cardsList: Card[];
}

const DeckList: FC<DeckListProps> = ({decksList, cardsList}) => {
  
  return (
    <div className="mb-6 flex flex-col items-start gap-3">
        {decksList.map(deck => {
          const cardsCount = cardsList.filter(card => card.deckId === deck.id).length;

          return (
            <DeckCard
              key={deck.id}
              deck={deck}
              cardsCount={cardsCount}
            />
          );
        })}
    </div>
  );
};

export default DeckList;