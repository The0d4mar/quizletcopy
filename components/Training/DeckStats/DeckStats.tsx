'use client'

import { setUpdatedCards } from '@/store/cardStore'; 
import { changeDeck } from '@/store/deckStore';
import { RootState } from '@/store/store';
import { Card, DeckStatsGroup } from '@/types/types.type';
import { Pencil, Star, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { useSelector } from 'react-redux';

interface DeckStatsProps {
  deckId: string;
  deckCards: Card[];
}


const DeckStats = ({ deckId, deckCards }: DeckStatsProps) => {
  const dispatch = useAppDispatch();

  const allCards = useSelector(
    (state: RootState) => state.cardStore.cards
  );

  const cardData = useSelector(
    (state: RootState) => state.cardDataStore.cardData
  );

  const deck = useSelector((state: RootState) =>
    state.deckStore.decks.find(item => item.id === deckId)
  );
  const isStatsOpen = deck?.isStatsOpen ?? true;

  const toggleStats = () => {
    if (!deck) return;

    dispatch(changeDeck({
      ...deck,
      isStatsOpen: !isStatsOpen,
    }));
  };

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editOriginal, setEditOriginal] = useState('');
  const [editTranslation, setEditTranslation] = useState('');

  const getCardData = (cardId: string) => {
    return cardData.find(data => data.cardId === cardId);
  };

  const startEditCard = (card: Card) => {
    setEditingCardId(card.id);
    setEditOriginal(card.original);
    setEditTranslation(card.translation);
  };

  const cancelEditCard = () => {
    setEditingCardId(null);
    setEditOriginal('');
    setEditTranslation('');
  };

  const saveEditCard = (cardId: string) => {
    const trimmedOriginal = editOriginal.trim();
    const trimmedTranslation = editTranslation.trim();

    if (!trimmedOriginal || !trimmedTranslation) return;

    const updatedCards = allCards.map(card =>
      card.id === cardId
        ? {
            ...card,
            original: trimmedOriginal,
            translation: trimmedTranslation,
            updatedAt: new Date().toISOString(),
          }
        : card
    );

    dispatch(setUpdatedCards(updatedCards));
    cancelEditCard();
  };

  const learnedCards = deckCards.filter(card => {
    const data = getCardData(card.id);

    return (
      data &&
      data.numOfRepeats > 0 &&
      data.wrongRepeats <= data.numOfRepeats
    );
  });

  const repeatCards = deckCards.filter(card => {
    const data = getCardData(card.id);

    return data && data.wrongRepeats > data.numOfRepeats;
  });

  const notLearnedCards = deckCards.filter(card => {
    const data = getCardData(card.id);

    return !data || data.numOfRepeats === 0;
  });

  const groups: DeckStatsGroup[] = [
    {
      title: `Изучены (${learnedCards.length})`,
      description: 'Эти слова уже успешно повторялись.',
      cards: learnedCards,
    },
    {
      title: `Надо повторить (${repeatCards.length})`,
      description: 'Эти слова чаще вызывают ошибки.',
      cards: repeatCards,
    },
    {
      title: `Ещё не изучены (${notLearnedCards.length})`,
      description: 'Эти слова ещё не проходили успешное повторение.',
      cards: notLearnedCards,
    },
  ];

  return (
    <section className="mt-[var(--gapSection)]">
      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <div>
          <h2 className="text-[var(--fontSizeLg)] font-bold">
            Термины в модуле ({deckCards.length})
          </h2>

          <p className="mt-2 text-[var(--colorTextMuted)]">
            Статистика повторений и сложные слова
          </p>
        </div>

        <button
          type="button"
          onClick={toggleStats}
          aria-expanded={isStatsOpen}
          className="button rounded-[var(--radiusPill)]"
        >
          {isStatsOpen ? 'Скрыть статистику' : 'Показать статистику'}
        </button>
      </div>

      {isStatsOpen && (
        <div className="flex flex-col gap-[var(--gapSection)]">
        {groups.map(group => (
          <div key={group.title}>
            <div className="mb-[var(--gapXl)]">
              <h3 className="text-[var(--fontSizeMd)] font-bold">
                {group.title}
              </h3>

              <p className="mt-2 text-[var(--colorTextMuted)]">
                {group.description}
              </p>
            </div>

            {group.cards.length === 0 ? (
              <div className="card text-[var(--colorTextMuted)]">
                В этом разделе пока нет слов
              </div>
            ) : (
              <div className="flex flex-col gap-[var(--gapMd)]">
                {group.cards.map(card => {
                  const data = getCardData(card.id);
                  const lastRepeat = data?.lastRepeat?.at(-1);
                  const isEditing = editingCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      className="card grid gap-4 md:grid-cols-[1fr_1fr_auto]"
                    >
                      {isEditing ? (
                        <>
                          <div>
                            <p className="mb-2 text-[var(--colorTextMuted)] font-bold">
                              Термин
                            </p>

                            <input
                              value={editOriginal}
                              onChange={e => setEditOriginal(e.target.value)}
                              className="
                                w-full
                                rounded-[var(--radiusCard)]
                                border
                                border-[var(--colorBorder)]
                                bg-[var(--colorBgSoft)]
                                px-[var(--paddingInputX)]
                                py-[var(--paddingInputY)]
                                font-bold
                                outline-none
                                focus:ring-2
                                focus:ring-[var(--colorFocus)]
                              "
                            />
                          </div>

                          <div>
                            <p className="mb-2 text-[var(--colorTextMuted)] font-bold">
                              Перевод
                            </p>

                            <input
                              value={editTranslation}
                              onChange={e => setEditTranslation(e.target.value)}
                              className="
                                w-full
                                rounded-[var(--radiusCard)]
                                border
                                border-[var(--colorBorder)]
                                bg-[var(--colorBgSoft)]
                                px-[var(--paddingInputX)]
                                py-[var(--paddingInputY)]
                                font-bold
                                outline-none
                                focus:ring-2
                                focus:ring-[var(--colorFocus)]
                              "
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => saveEditCard(card.id)}
                              className="button rounded-[var(--radiusPill)] bg-[var(--colorFocus)]"
                            >
                              Изменить
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditCard}
                              className="button rounded-[var(--radiusPill)] border-[var(--colorDanger)] text-[var(--colorDanger)]"
                            >
                              Отменить
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-[var(--fontSizeMd)] font-bold">
                              | {card.original} |
                            </p>
                          </div>

                          <div>
                            <p className="text-[var(--fontSizeMd)] font-bold">
                              | {card.translation} |
                            </p>

                            <p className="mt-2 text-[var(--fontSizeSm)] text-[var(--colorTextMuted)]">
                              Успешно: {data?.numOfRepeats ?? 0} · Ошибок:{' '}
                              {data?.wrongRepeats ?? 0}
                            </p>

                            {lastRepeat && (
                              <p className="text-[var(--fontSizeSm)] text-[var(--colorTextMuted)]">
                                Последнее повторение:{' '}
                                {new Date(lastRepeat).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <Star size={22} />
                            <Volume2 size={22} />

                            <button
                              type="button"
                              onClick={() => startEditCard(card)}
                            >
                              <Pencil size={22} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </section>
  );
};

export default DeckStats;