import { DeckCardProps } from '@/types/types.type';
import { IdCardLanyard } from 'lucide-react';
import Link from 'next/link';

const labels = {
  author: "\u0410\u0432\u0442\u043e\u0440",
  cards: "\u041a\u0430\u0440\u0442\u043e\u0447\u0435\u043a",
};

const DeckCard = ({ deck, cardsCount }: DeckCardProps) => {
  return (
    <Link className="deckCard" href={`/deck/${deck.id}`}>
      <div>
        <IdCardLanyard size={48} />
      </div>
      <div className="flex flex-col justify-start">
        <h2>{deck.title}</h2>
        <div className="deckCardInfo">
          <p>{labels.author}: {deck.createdBy}</p>
          <p>{labels.cards}: {cardsCount}</p>
        </div>
      </div>
    </Link>
  );
};

export default DeckCard;