'use client'

import { setUpdatedCards } from '@/store/cardStore';
import { changeDeck } from '@/store/deckStore';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { Card, DeckStatsGroup } from '@/types/types.type';
import { Pencil, Star, Volume2 } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface DeckStatsProps {
  deckId: string;
  deckCards: Card[];
}

const labels = {
  learned: "\u0418\u0437\u0443\u0447\u0435\u043d\u044b",
  learnedDescription: "\u042d\u0442\u0438 \u0441\u043b\u043e\u0432\u0430 \u0443\u0436\u0435 \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u043f\u043e\u0432\u0442\u043e\u0440\u044f\u043b\u0438\u0441\u044c.",
  repeat: "\u041d\u0430\u0434\u043e \u043f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c",
  repeatDescription: "\u042d\u0442\u0438 \u0441\u043b\u043e\u0432\u0430 \u0447\u0430\u0449\u0435 \u0432\u044b\u0437\u044b\u0432\u0430\u044e\u0442 \u043e\u0448\u0438\u0431\u043a\u0438.",
  notLearned: "\u0415\u0449\u0451 \u043d\u0435 \u0438\u0437\u0443\u0447\u0435\u043d\u044b",
  notLearnedDescription: "\u042d\u0442\u0438 \u0441\u043b\u043e\u0432\u0430 \u0435\u0449\u0451 \u043d\u0435 \u043f\u0440\u043e\u0445\u043e\u0434\u0438\u043b\u0438 \u0443\u0441\u043f\u0435\u0448\u043d\u043e\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435.",
  terms: "\u0422\u0435\u0440\u043c\u0438\u043d\u044b \u0432 \u043c\u043e\u0434\u0443\u043b\u0435",
  subtitle: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0439 \u0438 \u0441\u043b\u043e\u0436\u043d\u044b\u0435 \u0441\u043b\u043e\u0432\u0430",
  hideStats: "\u0421\u043a\u0440\u044b\u0442\u044c \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0443",
  showStats: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0443",
  emptyGroup: "\u0412 \u044d\u0442\u043e\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u0441\u043b\u043e\u0432",
  term: "\u0422\u0435\u0440\u043c\u0438\u043d",
  translation: "\u041f\u0435\u0440\u0435\u0432\u043e\u0434",
  save: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",
  cancel: "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
  success: "\u0423\u0441\u043f\u0435\u0448\u043d\u043e",
  mistakes: "\u041e\u0448\u0438\u0431\u043e\u043a",
  lastRepeat: "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0435\u0435 \u043f\u043e\u0432\u0442\u043e\u0440\u0435\u043d\u0438\u0435",
};

const DeckStats = ({ deckId, deckCards }: DeckStatsProps) => {
  const dispatch = useAppDispatch();

  const allCards = useSelector((state: RootState) => state.cardStore.cards);
  const cardData = useSelector((state: RootState) => state.cardDataStore.cardData);
  const deck = useSelector((state: RootState) => state.deckStore.decks.find(item => item.id === deckId));
  const isStatsOpen = deck?.isStatsOpen ?? true;

  const toggleStats = () => {
    if (!deck) return;
    dispatch(changeDeck({ ...deck, isStatsOpen: !isStatsOpen }));
  };

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editOriginal, setEditOriginal] = useState('');
  const [editTranslation, setEditTranslation] = useState('');

  const getCardData = (cardId: string) => cardData.find(data => data.cardId === cardId);

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
        ? { ...card, original: trimmedOriginal, translation: trimmedTranslation, updatedAt: new Date().toISOString() }
        : card,
    );

    dispatch(setUpdatedCards(updatedCards));
    cancelEditCard();
  };

  const repeatCards = deckCards.filter(card => {
    const data = getCardData(card.id);
    return Boolean(data && data.wrongRepeats > 0);
  });

  const learnedCards = deckCards.filter(card => {
    const data = getCardData(card.id);
    return Boolean(data && data.numOfRepeats > 0 && data.wrongRepeats === 0);
  });

  const notLearnedCards = deckCards.filter(card => {
    const data = getCardData(card.id);
    return !data || (data.numOfRepeats === 0 && data.wrongRepeats === 0);
  });

  const groups: DeckStatsGroup[] = [
    { title: `${labels.learned} (${learnedCards.length})`, description: labels.learnedDescription, cards: learnedCards },
    { title: `${labels.repeat} (${repeatCards.length})`, description: labels.repeatDescription, cards: repeatCards },
    { title: `${labels.notLearned} (${notLearnedCards.length})`, description: labels.notLearnedDescription, cards: notLearnedCards },
  ];

  return (
    <section className="mt-[var(--gapSection)]">
      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <div>
          <h2 className="text-[var(--fontSizeLg)] font-bold">{labels.terms} ({deckCards.length})</h2>
          <p className="mt-2 text-[var(--colorTextMuted)]">{labels.subtitle}</p>
        </div>

        <button type="button" onClick={toggleStats} aria-expanded={isStatsOpen} className="button rounded-[var(--radiusPill)]">
          {isStatsOpen ? labels.hideStats : labels.showStats}
        </button>
      </div>

      {isStatsOpen && (
        <div className="flex flex-col gap-[var(--gapSection)]">
          {groups.map(group => (
            <div key={group.title}>
              <div className="mb-[var(--gapXl)]">
                <h3 className="text-[var(--fontSizeMd)] font-bold">{group.title}</h3>
                <p className="mt-2 text-[var(--colorTextMuted)]">{group.description}</p>
              </div>

              {group.cards.length === 0 ? (
                <div className="card text-[var(--colorTextMuted)]">{labels.emptyGroup}</div>
              ) : (
                <div className="flex flex-col gap-[var(--gapMd)]">
                  {group.cards.map(card => {
                    const data = getCardData(card.id);
                    const lastRepeat = data?.lastRepeat?.at(-1);
                    const isEditing = editingCardId === card.id;

                    return (
                      <div key={card.id} className="card grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                        {isEditing ? (
                          <>
                            <div>
                              <p className="mb-2 text-[var(--colorTextMuted)] font-bold">{labels.term}</p>
                              <input value={editOriginal} onChange={e => setEditOriginal(e.target.value)} className="w-full rounded-[var(--radiusCard)] border border-[var(--colorBorder)] bg-[var(--colorBgSoft)] px-[var(--paddingInputX)] py-[var(--paddingInputY)] font-bold outline-none focus:ring-2 focus:ring-[var(--colorFocus)]" />
                            </div>

                            <div>
                              <p className="mb-2 text-[var(--colorTextMuted)] font-bold">{labels.translation}</p>
                              <input value={editTranslation} onChange={e => setEditTranslation(e.target.value)} className="w-full rounded-[var(--radiusCard)] border border-[var(--colorBorder)] bg-[var(--colorBgSoft)] px-[var(--paddingInputX)] py-[var(--paddingInputY)] font-bold outline-none focus:ring-2 focus:ring-[var(--colorFocus)]" />
                            </div>

                            <div className="flex items-center gap-3">
                              <button type="button" onClick={() => saveEditCard(card.id)} className="button rounded-[var(--radiusPill)] bg-[var(--colorFocus)]">{labels.save}</button>
                              <button type="button" onClick={cancelEditCard} className="button rounded-[var(--radiusPill)] border-[var(--colorDanger)] text-[var(--colorDanger)]">{labels.cancel}</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div><p className="text-[var(--fontSizeMd)] font-bold">| {card.original} |</p></div>
                            <div>
                              <p className="text-[var(--fontSizeMd)] font-bold">| {card.translation} |</p>
                              <p className="mt-2 text-[var(--fontSizeSm)] text-[var(--colorTextMuted)]">{labels.success}: {data?.numOfRepeats ?? 0} - {labels.mistakes}: {data?.wrongRepeats ?? 0}</p>
                              {lastRepeat && <p className="text-[var(--fontSizeSm)] text-[var(--colorTextMuted)]">{labels.lastRepeat}: {new Date(lastRepeat).toLocaleDateString()}</p>}
                            </div>

                            <div className="flex items-center gap-4">
                              <Star size={22} />
                              <Volume2 size={22} />
                              <button type="button" onClick={() => startEditCard(card)}><Pencil size={22} /></button>
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