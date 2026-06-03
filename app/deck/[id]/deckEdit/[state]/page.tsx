'use client'

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Deck } from '@/types/type';
import { loadCards, loadDecks, saveCards, saveDecks } from '@/storage';
import Link from 'next/link';
import { Plus, ChevronLeft } from 'lucide-react';
import { delCenDeck } from '@/api/localFunc';
import EditDeckComp from '@/components/ui/EditDeckComp/EditDeckComp';
import AddCardField from '@/components/ui/AddCardField/AddCardField';

export default function EditDeckPage() {
  const params = useParams<{ id: string, state: string }>();
  const router = useRouter();

  const deckId = params.id;
  const stater = params.state;
  console.log(stater)

  const [decks, setDecks] = useState<Deck[]>(() => loadDecks());
  const [cards, setCards] = useState<Card[]>(() => loadCards());
  const currentDeck = decks.find(deck => deck.id === deckId);

  const [deckTitle, setDeckTitle] = useState(() => currentDeck?.title ?? '');
  const [deckDescription, setDeckDescription] = useState(
    () => currentDeck?.description ?? ''
  );

  

  const deckCards = cards.filter(card => card.deckId === deckId);

  const updateCardOriginal = (cardId: string, value: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? {
              ...card,
              original: value,
              updatedAt: new Date().toISOString(),
            }
          : card
      )
    );
  };

  const updateCardTranslation = (cardId: string, value: string) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId
          ? {
              ...card,
              translation: value,
              updatedAt: new Date().toISOString(),
            }
          : card
      )
    );
  };

  const addCard = () => {
    const newCard: Card = {
      id: crypto.randomUUID(),
      deckId,
      original: '',
      translation: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCards(prev => [...prev, newCard]);
  };

  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const cancelDeckCreation = (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    delCenDeck(decks, deckId)
    router.push('/');
  }

  const saveChanges = (e: React.MouseEvent<HTMLButtonElement>, flag: number) => {
    e.preventDefault();
    const updatedDecks = decks.map(deck =>
      deck.id === deckId
        ? {
            ...deck,
            title: deckTitle.trim(),
            description: deckDescription.trim(),
            updatedAt: new Date().toISOString(),
          }
        : deck
    );

    saveDecks(updatedDecks);
    const updatedCards = cards.filter(card => card.original != '' && card.translation != '')
    saveCards(updatedCards);
    if(flag == 0) router.push('/');
    else {router.push(`/deck/${deckId}`);}

    
  };

  const updateDeckTitle = (id: string, value: string) => {
    setDeckTitle(value);
  }

  return (
    <section className="min-h-screen w-full px-10 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          {stater == '%7Bstate%3D%22renderDeck%22%7D' ?
            <Link
              href={`/deck/${deckId}`}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white"
            >
              <ChevronLeft size={20} />
                Назад к модулю
            </Link> 
          :
           <button className="font-light font-normal text-gray-700 underline underline-offset-3 hover:text-white" onClick={e => cancelDeckCreation(e)}>Cancel</button>
          }
          <div className = "flex items-center gap-5">
            {stater == 'state%3DcreateNewDeck' ?

            <button className="px-6 py-3 text-sm font-bold text-white" onClick={ e => saveChanges(e, 0)}>
                Создать и закрыть
            </button>

            :  null
            }

            <button
              onClick={e => saveChanges(e, 1)}
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
            >
              
              {stater == 'state%3DcreateNewDeck' ? "Открыть модуль": "Внести изменения"}
            </button>
          </div>
        </div>


        <div className="mb-8 space-y-3">
          <label className="block rounded-lg bg-slate-700 px-5 py-3">
            <span className="mb-1 block text-xs font-bold text-slate-300">
              Название
            </span>
            <EditDeckComp
                  original={deckTitle}
                  updateCardfunc={updateDeckTitle}
                  placeholder="Название колоды"
                  className="w-full bg-transparent text-lg font-bold text-white outline-none"
                  spanFlag={false}
                />

          </label>

          <textarea
            value={deckDescription}
            onChange={e => setDeckDescription(e.target.value)}
            placeholder="Добавьте описание..."
            className="min-h-[70px] w-full resize-none rounded-lg bg-slate-700 px-5 py-4 font-semibold text-white outline-none placeholder:text-slate-400"
          />
        </div>



        <div className="space-y-6">
          {deckCards.map((card, index) => (
            <AddCardField
              key={card.id}
              id={card.id}
              original={card.original}
              translation={card.translation}
              updateCardOriginal={updateCardOriginal}
              updateCardTranslation={updateCardTranslation}
              deleteCard={deleteCard}
              index={index}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 justify-center">
          <button
            onClick={addCard}
            className="flex items-center gap-2 rounded-full bg-slate-700 px-5 py-3 text-sm font-bold transition hover:bg-slate-600"
          >
            <Plus size={18} />
            Добавить карточку
          </button>
        </div>

       
      </div>
    </section>
  );
}