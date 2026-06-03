'use client'

import { addNewDeck } from '@/api/localFunc';
import { Deck } from '@/types/type';
import { useRouter } from 'next/navigation';
import React from 'react';
import {FC} from 'react';

interface AddDeckBtnProps {
    decks: Deck[];
}

const AddDeckBtn: FC<AddDeckBtnProps> = ({ decks }) => {

    const router = useRouter();
      const addDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        const id = addNewDeck(decks);
    
        router.push(`/deck/${id}/deckEdit/state=createNewDeck`);
      };
  return (
    <button
          onClick={addDeck}
          className="border-1 rounded-[var(--radius-card)] flex justify-center items-center px-[var(--padding-x-card)] py-[var(--padding-y-card)]"
    >
          Добавить колоду
    </button>
  );
};

export default AddDeckBtn;