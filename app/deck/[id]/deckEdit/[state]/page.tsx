'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Deck } from '@/types/type';
import { loadCards, loadDecks, saveCards, saveDecks } from '@/storage';
import Link from 'next/link';
import { Trash2, Plus, ChevronLeft } from 'lucide-react';
import { delCenDeck } from '@/api/localFunc';

export default function EditDeckPage() {
  const params = useParams<{ id: string, state: string }>();
  const router = useRouter();

  const deckId = params.id;
  const stater = params.state;
  console.log(stater)

  const [decks, setDecks] = useState<Deck[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [deckTitle, setDeckTitle] = useState('');
  const [deckDescription, setDeckDescription] = useState('');

  useEffect(() => {
    const storedDecks = loadDecks();
    const storedCards = loadCards();

    const currentDeck = storedDecks.find(deck => deck.id === deckId);

    setDecks(storedDecks);
    setCards(storedCards);

    if (currentDeck) {
      setDeckTitle(currentDeck.title);
      setDeckDescription(currentDeck.description ?? '');
    }
  }, [deckId]);

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
            {stater == '%7Bstate%3D%22createNewDeck%22%7D' ?

            <button className="px-6 py-3 text-sm font-bold text-white" onClick={ e => saveChanges(e, 0)}>
                Создать и закрыть
            </button>

            :  null
            }

            <button
              onClick={e => saveChanges(e, 1)}
              className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-400"
            >
              
              {stater == '%7Bstate%3D%22createNewDeck%22%7D' ? "Открыть модуль": "Внести изменения"}
            </button>
          </div>
        </div>


        <div className="mb-8 space-y-3">
          <label className="block rounded-lg bg-slate-700 px-5 py-3">
            <span className="mb-1 block text-xs font-bold text-slate-300">
              Название
            </span>

            <input
              value={deckTitle}
              onChange={e => setDeckTitle(e.target.value)}
              className="w-full bg-transparent text-lg font-bold text-white outline-none"
              placeholder="Название колоды"
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
            <div
              key={card.id}
              className="rounded-2xl bg-slate-700 px-6 py-5"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-bold text-slate-200">
                  {index + 1}
                </span>

                <button
                  onClick={() => deleteCard(card.id)}
                  className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-600 hover:text-white"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <input
                    value={card.original}
                    onChange={e => updateCardOriginal(card.id, e.target.value)}
                    placeholder="Термин"
                    className="w-full rounded-lg bg-[#0b092b] px-4 py-4 text-lg font-bold text-white outline-none"
                  />

                  <span className="mt-3 block text-xs font-bold uppercase text-slate-300">
                    Термин
                  </span>
                </div>

                <div>
                  <input
                    value={card.translation}
                    onChange={e =>
                      updateCardTranslation(card.id, e.target.value)
                    }
                    placeholder="Определение"
                    className="w-full rounded-lg bg-[#0b092b] px-4 py-4 text-lg font-bold text-white outline-none"
                  />

                  <span className="mt-3 block text-xs font-bold uppercase text-slate-300">
                    Определение
                  </span>
                </div>
              </div>
            </div>
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