'use client'

import DeckCard from '../Card/DeckCard';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FC } from 'react';
import { Folder } from '@/types/type';

interface DeckListProps {
  currentFolder?: Folder,
  folderId?: string
  searchValue?: string,
}


const DeckList :FC<DeckListProps> = ({currentFolder  = [], folderId = 'NaFolder', searchValue = ''}) => {

  const decksList = useSelector((state: RootState) => state.deckStore.decks)
  let filteredDecks = decksList;

  if(folderId != 'NaFolder'){

    const folderDecks =
    decksList.filter(deck =>
      currentFolder?.deckIds.includes(deck.id)
    ) || [];

    filteredDecks = folderDecks.filter(deck =>
      deck.title
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    );
    console.log(filteredDecks)
  }
  
  const cardsList = useSelector((state: RootState) => state.cardStore.cards)
  
  return (
    <div className="mb-6 flex flex-col items-start gap-3">
        {filteredDecks.map(deck => {
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