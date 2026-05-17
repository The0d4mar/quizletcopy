
import { Deck, DeckCardProps } from '@/types/type';
import { IdCardLanyard} from 'lucide-react';
import Link from 'next/link';
import React, {FC} from 'react';



const DeckCard:FC<DeckCardProps> = ({deck, cardsCount}) => {
  return (
    <Link className="mb-3 flex gap-5 items-center border-1 border-white rounded-2xl px-3 py-4" href = {`/deck/${deck.id}`}>
        <div>
            <IdCardLanyard size={48}/>
        </div>
        <div className='flex flex-col justify-start'>
            <h2>{deck.title}</h2>
            <div className='flex items-center gap-5'>
                <p>Автор: {deck.createdBy}</p>
                <p>Карточек: {cardsCount}</p>
            </div>
        </div>
    </Link>
  );
};

export default DeckCard;