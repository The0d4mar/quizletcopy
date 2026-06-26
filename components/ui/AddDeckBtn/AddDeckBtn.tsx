'use client'

import { useRouter } from 'next/navigation';
import React from 'react';


const AddDeckBtn = () => {
    const router = useRouter();
    const addDeck = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
  
      const id = crypto.randomUUID()
  
      router.push(`/deck/${id}/deckEdit/state=createNewDeck`);
    };
  return (
    <button
          onClick={addDeck}
          className="button button:hover:not(:disabled)"
    >
          Добавить колоду
    </button>
  );
};

export default AddDeckBtn;