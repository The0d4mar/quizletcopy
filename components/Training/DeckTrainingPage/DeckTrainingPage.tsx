"use client";

import ConnectDecksModal from "@/components/ui/ConnectDecks/ConnectDecksModal";
import DropDownDeckMenu from "@/components/ui/DropDownDeck/DropDownDeckMenu";
import { useDeckCards } from "@/features/cards/useCards";
import { useDeck, useUpdateDeck } from "@/features/decks/useDecks";
import { useCopyPublicDeck } from "@/features/decks/usePublicDecks";
import { TrainingMode } from "@/types/types.type";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DeckStats from "../DeckStats/DeckStats";
import FlashcardsMode from "../FlashcardsMode/FlashcardsMode";
import LearnMode from "../LearnMode/LearnMode";
import TestMode from "../TestMode/TestMode";
import TrainingModeTabs from "../TrainingModeTabs/TrainingModeTabs";

const labels = {
  backHome: "\u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e",
  loading: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043a\u043e\u043b\u043e\u0434\u0443...",
  empty: "\u0412 \u044d\u0442\u043e\u0439 \u043a\u043e\u043b\u043e\u0434\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a",
  readOnlyNotice: "\u042d\u0442\u043e \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u0430\u044f \u043a\u043e\u043b\u043e\u0434\u0430. \u0414\u043e \u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0434\u043e\u0441\u0442\u0443\u043f\u0435\u043d \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440 \u043a\u0430\u0440\u0442\u043e\u0447\u0435\u043a.",
  copy: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0435\u0431\u0435",
  copying: "\u041a\u043e\u043f\u0438\u0440\u0443\u0435\u043c...",
  loginToCopy: "\u0412\u043e\u0439\u0442\u0438, \u0447\u0442\u043e\u0431\u044b \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
};

const DeckTrainingPage = () => {
  const params = useParams<{ id: string }>();
  const deckId = params.id;
  const lastRepeatSavedForDeckId = useRef<string | null>(null);
  const [trainingMode, setTrainingMode] = useState<TrainingMode>("cards");

  const { data: session } = useSession();
  const deckQuery = useDeck(deckId);
  const cardsQuery = useDeckCards(deckId);
  const updateDeckMutation = useUpdateDeck();
  const copyPublicDeckMutation = useCopyPublicDeck();

  const deck = deckQuery.data;
  const deckCards = cardsQuery.data ?? [];
  const userId = session?.user?.id;
  const isOwnDeck = Boolean(deck && userId && deck.ownerId === userId);
  const isReadOnlyPublicDeck = Boolean(deck?.public && !isOwnDeck);
  const activeTrainingMode: TrainingMode = isReadOnlyPublicDeck ? "cards" : trainingMode;


  useEffect(() => {
    if (!deck || isReadOnlyPublicDeck || lastRepeatSavedForDeckId.current === deckId) return;

    lastRepeatSavedForDeckId.current = deckId;
    updateDeckMutation.mutate({
      ...deck,
      lastRepeat: new Date().toISOString(),
    });
  }, [deck, deckId, isReadOnlyPublicDeck, updateDeckMutation]);

  return (
    <section className="mainSection">
      {!isReadOnlyPublicDeck && <ConnectDecksModal sendedDeckId={deckId} onConnected={() => void cardsQuery.refetch()} />}

      <div className="mb-[var(--gapXl)] flex justify-start">
        <Link href="/" className="custom-btn-back custom-btn-back:hover">
          {labels.backHome}
        </Link>
      </div>

      <div className="mb-[var(--gapXl)] flex items-center justify-between gap-4">
        <div>
          <h1 className="max-w-[520px] truncate text-[24px] font-bold leading-[var(--lineHeightTight)]">
            {deck?.title}
          </h1>

          {isReadOnlyPublicDeck && <p className="mt-2 max-w-[680px] text-[var(--colorTextMuted)]">{labels.readOnlyNotice}</p>}
        </div>

        {isReadOnlyPublicDeck ? (
          userId ? (
            <button
              type="button"
              className="button"
              disabled={copyPublicDeckMutation.isPending}
              onClick={() => copyPublicDeckMutation.mutate(deckId)}
            >
              {copyPublicDeckMutation.isPending ? labels.copying : labels.copy}
            </button>
          ) : (
            <Link className="button" href={`/login?callbackUrl=/deck/${deckId}`}>
              {labels.loginToCopy}
            </Link>
          )
        ) : (
          <DropDownDeckMenu localId={deckId} />
        )}
      </div>

      <TrainingModeTabs
        currentMode={activeTrainingMode}
        onChangeMode={setTrainingMode}
        availableModes={isReadOnlyPublicDeck ? ["cards"] : ["cards", "learn", "test"]}
      />

      {deckQuery.isLoading || cardsQuery.isLoading ? (
        <p className="card text-[var(--colorTextMuted)]">{labels.loading}</p>
      ) : deckCards.length === 0 ? (
        <p className="card text-[var(--colorTextMuted)]">{labels.empty}</p>
      ) : (
        <>
          {activeTrainingMode === "cards" && (
            <FlashcardsMode
              deckCards={deckCards}
              deckTitle={deck?.title ?? ""}
              onExit={() => setTrainingMode("cards")}
              canTrackProgress={!isReadOnlyPublicDeck}
            />
          )}

          {!isReadOnlyPublicDeck && activeTrainingMode === "learn" && (
            <LearnMode deckTitle={deck?.title ?? ""} deckCards={deckCards} onExit={() => setTrainingMode("cards")} />
          )}

          {!isReadOnlyPublicDeck && activeTrainingMode === "test" && (
            <TestMode deckTitle={deck?.title ?? ""} deckCards={deckCards} onExit={() => setTrainingMode("cards")} />
          )}

          {!isReadOnlyPublicDeck && activeTrainingMode === "cards" && <DeckStats deckId={deckId} deckCards={deckCards} />}
        </>
      )}
    </section>
  );
};

export default DeckTrainingPage;