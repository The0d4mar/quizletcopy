'use client'

import { setUpdatedCards } from '@/store/cardStore';
import { RootState } from '@/store/store';
import { Card } from '@/types/type';
import { Pencil, Star, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface DeckStatsProps {
  deckCards: Card[];
}

type DeckStatsGroup = {
  title: string;
  description: string;
  cards: Card[];
};

const DeckStats = ({ deckCards }: DeckStatsProps) => {
  const dispatch = useDispatch();

  const allCards = useSelector(
    (state: RootState) => state.cardStore.cards
  );

  const cardData = useSelector(
    (state: RootState) => state.cardDataStore.cardData
  );

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
    <section className="mt-[var(--section-gap)]">
      <div className="mb-[var(--block-gap)] flex items-center justify-between">
        <div>
          <h2 className="text-[var(--font-size-lg)] font-bold">
            Термины в модуле ({deckCards.length})
          </h2>

          <p className="mt-2 text-[var(--color-text-muted)]">
            Статистика повторений и сложные слова
          </p>
        </div>

        <button
          type="button"
          className="custom-btn rounded-[var(--radius-button)]"
        >
          Ваша статистика
        </button>
      </div>

      <div className="flex flex-col gap-[var(--section-gap)]">
        {groups.map(group => (
          <div key={group.title}>
            <div className="mb-[var(--block-gap)]">
              <h3 className="text-[var(--font-size-md)] font-bold">
                {group.title}
              </h3>

              <p className="mt-2 text-[var(--color-text-muted)]">
                {group.description}
              </p>
            </div>

            {group.cards.length === 0 ? (
              <div className="app-card text-[var(--color-text-muted)]">
                В этом разделе пока нет слов
              </div>
            ) : (
              <div className="flex flex-col gap-[var(--item-gap)]">
                {group.cards.map(card => {
                  const data = getCardData(card.id);
                  const lastRepeat = data?.lastRepeat?.at(-1);
                  const isEditing = editingCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      className="app-card grid gap-4 md:grid-cols-[1fr_1fr_auto]"
                    >
                      {isEditing ? (
                        <>
                          <div>
                            <p className="mb-2 text-[var(--color-text-muted)] font-bold">
                              Термин
                            </p>

                            <input
                              value={editOriginal}
                              onChange={e => setEditOriginal(e.target.value)}
                              className="
                                w-full
                                rounded-[var(--radius-card)]
                                border
                                border-[var(--color-border)]
                                bg-[var(--color-bg-soft)]
                                px-[var(--padding-x-input)]
                                py-[var(--padding-y-input)]
                                font-bold
                                outline-none
                                focus:ring-2
                                focus:ring-[var(--color-focus)]
                              "
                            />
                          </div>

                          <div>
                            <p className="mb-2 text-[var(--color-text-muted)] font-bold">
                              Перевод
                            </p>

                            <input
                              value={editTranslation}
                              onChange={e => setEditTranslation(e.target.value)}
                              className="
                                w-full
                                rounded-[var(--radius-card)]
                                border
                                border-[var(--color-border)]
                                bg-[var(--color-bg-soft)]
                                px-[var(--padding-x-input)]
                                py-[var(--padding-y-input)]
                                font-bold
                                outline-none
                                focus:ring-2
                                focus:ring-[var(--color-focus)]
                              "
                            />
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => saveEditCard(card.id)}
                              className="custom-btn rounded-[var(--radius-button)] bg-[var(--color-focus)]"
                            >
                              Изменить
                            </button>

                            <button
                              type="button"
                              onClick={cancelEditCard}
                              className="custom-btn rounded-[var(--radius-button)] border-[var(--color-danger)] text-[var(--color-danger)]"
                            >
                              Отменить
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-[var(--font-size-md)] font-bold">
                              | {card.original} |
                            </p>
                          </div>

                          <div>
                            <p className="text-[var(--font-size-md)] font-bold">
                              | {card.translation} |
                            </p>

                            <p className="mt-2 text-[var(--font-size-sm)] text-[var(--color-text-muted)]">
                              Успешно: {data?.numOfRepeats ?? 0} · Ошибок:{' '}
                              {data?.wrongRepeats ?? 0}
                            </p>

                            {lastRepeat && (
                              <p className="text-[var(--font-size-sm)] text-[var(--color-text-muted)]">
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
    </section>
  );
};

export default DeckStats;