'use client'

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Deck} from '@/types/types.type';
import Link from 'next/link';
import { Plus, ChevronLeft } from 'lucide-react';
import { addNewCard, basicDeckName, delCenDeck } from '@/api/localFunc';
import EditDeckComp from '@/components/ui/EditDeckComp/EditDeckComp';
import AddCardField from '@/components/ui/AddCardField/AddCardField';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { delDecks, pushDeck, setDecks } from '@/store/deckStore';
import { setUpdatedCards } from '@/store/cardStore';

const EditDeckPage = () => {
  const params = useParams<{ id: string, state: string }>();
  const router = useRouter();

  const deckId = params.id;

const decks = useSelector(
  (state: RootState) => state.deckStore.decks
);

const newDeckTitle = basicDeckName(decks);

const currentDeck: Deck =
  decks.find(deck => deck.id === deckId) ?? {
    id: deckId,
    title: newDeckTitle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    public: false,
    createdBy: 'User',
    lastRepeat: new Date().toISOString(),
    isStatsOpen: true,
  };

const stater = params.state;

  const [cards, setCards] = useState<Card[]>(useSelector((state: RootState) => state.cardStore.cards));
  const dispatch = useDispatch()

  const [deckTitle, setDeckTitle] = useState(() => currentDeck?.title ?? '');
  const [deckDescription, setDeckDescription] = useState(
    () => currentDeck?.description ?? ''
  );
  const [isPublic, setIsPublic] = useState(() => currentDeck.public);


  const normalizeWord = (value: string) => value.trim().toLowerCase();

  const isDuplicateOriginal = (cardId: string, value: string) => {
  const normalizedValue = normalizeWord(value);

    if (!normalizedValue) return false;
    
    return deckCards.some(
      card =>
        card.id !== cardId &&
        normalizeWord(card.original) === normalizedValue
    );
  };

  const isDuplicateTranslation = (cardId: string, value: string) => {
    const normalizedValue = normalizeWord(value);

    if (!normalizedValue) return false;

    return deckCards.some(
      card =>
        card.id !== cardId &&
        normalizeWord(card.translation) === normalizedValue
    );
  };

  

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
    
    const newCard = addNewCard(deckId)
    setCards(prev => [...prev, newCard]);
  };

  const deleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const cancelDeckCreation = (e: React.MouseEvent<HTMLButtonElement>) =>{
    e.preventDefault();
    router.push('/');
  }

  const saveChanges = (e: React.MouseEvent<HTMLButtonElement>, flag: number) => {
    e.preventDefault();
    const newDeck =  {
        id: deckId,
        title: deckTitle,
        description: deckDescription,
        createdAt: currentDeck.createdAt,
        updatedAt: currentDeck.updatedAt,
        public: isPublic,
        createdBy: currentDeck.createdBy,
        lastRepeat: currentDeck.lastRepeat,
        isStatsOpen: currentDeck.isStatsOpen,
        };
    dispatch(delDecks(deckId))
    dispatch(pushDeck(newDeck))
    const updatedCards = cards.filter(card => card.original != '' && card.translation != '')
    dispatch(setUpdatedCards(updatedCards))
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
           <button className="font-light font-normal text-[var(--colorTextDisabled)] underline underline-offset-3 transition-all duration-0.3 hover:text-[var(--color-text)]" onClick={e => cancelDeckCreation(e)}>Cancel</button>
          }
          <div className = "flex items-center gap-5">
            {stater == 'state%3DcreateNewDeck' ?

            <button className="px-[var(--paddingButtonX)] py-[var(--paddingButtonY)] text-sm font-bold text-white border border-[var(--colorBorder)] rounded-full transition hover:border-[var(--colorBorderHover)]" onClick={ e => saveChanges(e, 0)}>
                Создать и закрыть
            </button>

            :  null
            }

            <button
              onClick={e => saveChanges(e, 1)}
              className="px-[var(--paddingButtonX)] py-[var(--paddingButtonY)] text-sm font-bold text-white border border-[var(--colorBorder)] rounded-full transition hover:border-[var(--colorBorderHover)] transition hover:bg-[var(--colorSuccess)] hover:text-white"
            >
              
              {stater == 'state%3DcreateNewDeck' ? "Открыть модуль": "Внести изменения"}
            </button>
          </div>
        </div>


        <div className="mb-8 space-y-3">
          <label className="block rounded-[var(--radiusLg)] bg-[var(--colorSurfaceMuted)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] border border-[var(--colorBorder)]">
            <span className="mb-1 block text-xs font-bold text-[var(--colorTextMuted)]">
              Название
            </span>
            <EditDeckComp
                  original={deckTitle}
                  updateCardfunc={updateDeckTitle}
                  placeholder="Название колоды"
                  className="w-full bg-transparent text-lg font-bold text-white outline-none "
                  spanFlag={false}
                />

          </label>

          <div className="listRow cardWithoutBg cardFlat">
            <span className="fontSizeMd">Публичная колода</span>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              aria-label="Публичная колода"
              onClick={() => setIsPublic(previousValue => !previousValue)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-[var(--radiusPill)] transition-colors ${isPublic ? 'bg-[var(--colorFocus)]' : 'bg-[var(--colorSurfaceLight)]'}`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          <textarea
            value={deckDescription}
            onChange={e => setDeckDescription(e.target.value)}
            placeholder="Добавьте описание..."
            className="min-h-[70px] w-full resize-none rounded-[var(--radiusLg)] bg-[var(--colorSurfaceMuted)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] font-semibold text-white outline-none placeholder:text-[var(--colorTextMuted)]"
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
              originalError={isDuplicateOriginal(card.id, card.original)}
              translationError={isDuplicateTranslation(card.id, card.translation)}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4 justify-center">
          <button
            onClick={addCard}
            className="button"
          >
            <Plus size={18} />
            Добавить карточку
          </button>
        </div>

       
      </div>
    </section>
  );
};

export default EditDeckPage;
