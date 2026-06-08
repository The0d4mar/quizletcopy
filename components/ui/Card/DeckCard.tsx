
import { Deck, DeckCardProps } from '@/types/type';
import { IdCardLanyard} from 'lucide-react';
import Link from 'next/link';
import React, {FC} from 'react';



const DeckCard:FC<DeckCardProps> = ({deck, cardsCount}) => {
  return (
    <Link className="custom-deck" href = {`/deck/${deck.id}`}>
        <div>
            <IdCardLanyard size={48}/>
        </div>
        <div className='flex flex-col justify-start'>
            <h2>{deck.title}</h2>
            <div className='custom-deck-info'>
                <p>Автор: {deck.createdBy}</p>
                <p>Карточек: {cardsCount}</p>
            </div>
        </div>
    </Link>
  );
};

export default DeckCard;