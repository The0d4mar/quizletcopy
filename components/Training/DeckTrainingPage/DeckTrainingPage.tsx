'use client'

import ConnectDecksModal from '@/components/ui/ConnectDecks/ConnectDecksModal';
import DropDownDeckMenu from '@/components/ui/DropDownDeck/DropDownDeckMenu';
import { updateDeckLastRepeat } from '@/api/localFunc';
import { loadCards } from '@/storage';
import { RootState } from '@/store/store';
import { Card, TrainingMode } from '@/types/types.type';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FlashcardsMode from '../FlashcardsMode/FlashcardsMode';
import LearnMode from '../LearnMode/LearnMode';
import TestMode from '../TestMode/TestMode';
import TrainingModeTabs from '../TrainingModeTabs/TrainingModeTabs';
import DeckStats from '../DeckStats/DeckStats';

const DeckTrainingPage = () => {
  const params = useParams<{ id: string }>();
  const deckId = params.id;

  const decks = useSelector((state: RootState) => state.deckStore.decks);
  const storeCards = useSelector((state: RootState) => state.cardStore.cards);

  const [cards, setCards] = useState<Card[]>(storeCards);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('cards');

  const deck = decks.find(deck => deck.id === deckId);
  const deckCards = storeCards.filter(card => card.deckId === deckId);  

  useEffect(() => {
    updateDeckLastRepeat(decks, deckId);
  }, [deckId]);

  const refreshCards = () => {
    setCards(loadCards());
  };

  return (
    <section className="mainSection">
      <ConnectDecksModal
        sendedDeckId={deckId}
        onConnected={refreshCards}
      />

      <div className="mb-[var(--gapXl)] flex justify-start">
        <Link
          href="/"
          className="custom-btn-back custom-btn-back:hover"
        >
          На главную
        </Link>
      </div>

      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <h1 className="max-w-[520px] truncate text-[24px] font-bold leading-[var(--lineHeightTight)]">
          {deck?.title}
        </h1>

        <DropDownDeckMenu localId={deckId} />
      </div>

      <TrainingModeTabs
        currentMode={trainingMode}
        onChangeMode={setTrainingMode}
      />

      {deckCards.length === 0 ? (
        <p className="card text-[var(--colorTextMuted)]">
          В этой колоде пока нет карточек
        </p>
      ) : (
        <>
          {trainingMode === 'cards' && (
            <FlashcardsMode
              deckCards={deckCards}
              deckTitle={deck?.title ?? ''}
              onExit={() => setTrainingMode('cards')}
              deckId = {deckId}
            />
          )}

          {trainingMode === 'learn' && (
            <LearnMode
              deckTitle={deck?.title ?? ''}
              deckCards={deckCards}
              onExit={() => setTrainingMode('cards')}
            />
          )}

          {trainingMode === 'test' && (
            <TestMode
              deckTitle={deck?.title ?? ''}
              deckCards={deckCards}
              onExit={() => setTrainingMode('cards')}
            />
          )}
          {trainingMode === 'cards' && (
            <>
                <DeckStats deckId={deckId} deckCards={deckCards} />
            </>
        )}
        </>
      )}
    </section>
  );
};

export default DeckTrainingPage;
