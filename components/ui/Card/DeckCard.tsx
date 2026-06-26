
import { Deck, DeckCardProps } from '@/types/types.type';
import { IdCardLanyard} from 'lucide-react';
import Link from 'next/link';
import React from 'react';



const DeckCard = ({deck, cardsCount}: DeckCardProps) => {
  return (
    <Link className="deckCard" href = {`/deck/${deck.id}`}>
        <div>
            <IdCardLanyard size={48}/>
        </div>
        <div className='flex flex-col justify-start'>
            <h2>{deck.title}</h2>
            <div className='deckCardInfo'>
                <p>Автор: {deck.createdBy}</p>
                <p>Карточек: {cardsCount}</p>
            </div>
        </div>
    </Link>
  );
};

export default DeckCard;