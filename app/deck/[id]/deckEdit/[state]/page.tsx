"use client";

import AddCardField from "@/components/ui/AddCardField/AddCardField";
import EditDeckComp from "@/components/ui/EditDeckComp/EditDeckComp";
import { addNewCard, basicDeckName } from "@/api/localFunc";
import { persistCardsToApi } from "@/lib/api/cardsApi";
import { queryKeys } from "@/lib/query/queryKeys";
import { useDeck, useDecks, useCreateDeck, useUpdateDeck } from "@/features/decks/useDecks";
import { setUpdatedCards } from "@/store/cardStore";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { Card, Deck } from "@/types/types.type";
import { ChevronLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

const labels = {
  backToDeck: "\u041d\u0430\u0437\u0430\u0434 \u043a \u043c\u043e\u0434\u0443\u043b\u044e",
  cancel: "\u041e\u0442\u043c\u0435\u043d\u0430",
  createAndClose: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u0438 \u0437\u0430\u043a\u0440\u044b\u0442\u044c",
  openDeck: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u043e\u0434\u0443\u043b\u044c",
  saveChanges: "\u0412\u043d\u0435\u0441\u0442\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f",
  saving: "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c...",
  title: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",
  titlePlaceholder: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043a\u043e\u043b\u043e\u0434\u044b",
  publicDeck: "\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u0430\u044f \u043a\u043e\u043b\u043e\u0434\u0430",
  descriptionPlaceholder: "\u0414\u043e\u0431\u0430\u0432\u044c\u0442\u0435 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0435...",
  addCard: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0443",
};

const createFallbackDeck = (deckId: string, title: string): Deck => ({
  id: deckId,
  title,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  public: false,
  createdBy: "User",
  lastRepeat: new Date().toISOString(),
  isStatsOpen: true,
});

interface EditDeckFormProps {
  currentDeck: Deck;
  deckId: string;
  isCreateMode: boolean;
  isRenderDeckMode: boolean;
  initialCards: Card[];
}

const EditDeckForm = ({ currentDeck, deckId, isCreateMode, isRenderDeckMode, initialCards }: EditDeckFormProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const createDeckMutation = useCreateDeck();
  const updateDeckMutation = useUpdateDeck();

  const [cards, setCards] = useState<Card[]>(initialCards);
  const [deckTitle, setDeckTitle] = useState(() => currentDeck.title);
  const [deckDescription, setDeckDescription] = useState(() => currentDeck.description ?? "");
  const [isPublic, setIsPublic] = useState(() => currentDeck.public);

  const normalizeWord = (value: string) => value.trim().toLowerCase();
  const deckCards = cards.filter((card) => card.deckId === deckId);
  const isSaving = createDeckMutation.isPending || updateDeckMutation.isPending;

  const isDuplicateOriginal = (cardId: string, value: string) => {
    const normalizedValue = normalizeWord(value);

    if (!normalizedValue) return false;

    return deckCards.some((card) => card.id !== cardId && normalizeWord(card.original) === normalizedValue);
  };

  const isDuplicateTranslation = (cardId: string, value: string) => {
    const normalizedValue = normalizeWord(value);

    if (!normalizedValue) return false;

    return deckCards.some((card) => card.id !== cardId && normalizeWord(card.translation) === normalizedValue);
  };

  const updateCardOriginal = (cardId: string, value: string) => {
    setCards((previousCards) =>
      previousCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              original: value,
              updatedAt: new Date().toISOString(),
            }
          : card,
      ),
    );
  };

  const updateCardTranslation = (cardId: string, value: string) => {
    setCards((previousCards) =>
      previousCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              translation: value,
              updatedAt: new Date().toISOString(),
            }
          : card,
      ),
    );
  };

  const addCard = () => {
    const newCard = addNewCard(deckId);
    setCards((previousCards) => [...previousCards, newCard]);
  };

  const deleteCard = (cardId: string) => {
    setCards((previousCards) => previousCards.filter((card) => card.id !== cardId));
  };

  const cancelDeckCreation = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push("/");
  };

  const saveChanges = async (event: React.MouseEvent<HTMLButtonElement>, redirectFlag: number) => {
    event.preventDefault();

    const trimmedTitle = deckTitle.trim();
    if (!trimmedTitle || isSaving) return;

    const deckPayload = {
      id: deckId,
      title: trimmedTitle,
      description: deckDescription.trim() || undefined,
      public: isPublic,
      lastRepeat: currentDeck.lastRepeat,
    };

    if (isCreateMode) {
      await createDeckMutation.mutateAsync({
        ...currentDeck,
        ...deckPayload,
        createdAt: currentDeck.createdAt,
        updatedAt: new Date().toISOString(),
        createdBy: currentDeck.createdBy,
      });
    } else {
      await updateDeckMutation.mutateAsync(deckPayload);
    }

    const updatedCards = cards.filter((card) => card.original !== "" && card.translation !== "");
    await persistCardsToApi(updatedCards, initialCards);
    dispatch(setUpdatedCards(updatedCards));
    queryClient.setQueryData(queryKeys.deckCards(deckId), updatedCards.filter((card) => card.deckId === deckId));
    await queryClient.invalidateQueries({ queryKey: queryKeys.deckCards(deckId) });
    await queryClient.invalidateQueries({ queryKey: queryKeys.cards });

    router.push(redirectFlag === 0 ? "/" : `/deck/${deckId}`);
  };

  const updateDeckTitle = (_id: string, value: string) => {
    setDeckTitle(value);
  };

  return (
    <section className="min-h-screen w-full px-10 py-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          {isRenderDeckMode ? (
            <Link href={`/deck/${deckId}`} className="flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white">
              <ChevronLeft size={20} />
              {labels.backToDeck}
            </Link>
          ) : (
            <button
              className="font-light font-normal text-[var(--colorTextDisabled)] underline underline-offset-3 transition-all duration-0.3 hover:text-[var(--color-text)]"
              onClick={(event) => cancelDeckCreation(event)}
            >
              {labels.cancel}
            </button>
          )}

          <div className="flex items-center gap-5">
            {isCreateMode ? (
              <button
                className="px-[var(--paddingButtonX)] py-[var(--paddingButtonY)] text-sm font-bold text-white border border-[var(--colorBorder)] rounded-full transition hover:border-[var(--colorBorderHover)] disabled:opacity-60"
                onClick={(event) => saveChanges(event, 0)}
                disabled={isSaving}
              >
                {isSaving ? labels.saving : labels.createAndClose}
              </button>
            ) : null}

            <button
              onClick={(event) => saveChanges(event, 1)}
              disabled={isSaving}
              className="px-[var(--paddingButtonX)] py-[var(--paddingButtonY)] text-sm font-bold text-white border border-[var(--colorBorder)] rounded-full transition hover:border-[var(--colorBorderHover)] hover:bg-[var(--colorSuccess)] hover:text-white disabled:opacity-60"
            >
              {isSaving ? labels.saving : isCreateMode ? labels.openDeck : labels.saveChanges}
            </button>
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <label className="block rounded-[var(--radiusLg)] bg-[var(--colorSurfaceMuted)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] border border-[var(--colorBorder)]">
            <span className="mb-1 block text-xs font-bold text-[var(--colorTextMuted)]">{labels.title}</span>
            <EditDeckComp
              original={deckTitle}
              updateCardfunc={updateDeckTitle}
              placeholder={labels.titlePlaceholder}
              className="w-full bg-transparent text-lg font-bold text-white outline-none"
              spanFlag={false}
            />
          </label>

          <div className="listRow cardWithoutBg cardFlat">
            <span className="fontSizeMd">{labels.publicDeck}</span>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              aria-label={labels.publicDeck}
              onClick={() => setIsPublic((previousValue) => !previousValue)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-[var(--radiusPill)] transition-colors ${isPublic ? "bg-[var(--colorFocus)]" : "bg-[var(--colorSurfaceLight)]"}`}
            >
              <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${isPublic ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          <textarea
            value={deckDescription}
            onChange={(event) => setDeckDescription(event.target.value)}
            placeholder={labels.descriptionPlaceholder}
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
          <button onClick={addCard} className="button">
            <Plus size={18} />
            {labels.addCard}
          </button>
        </div>
      </div>
    </section>
  );
};

const EditDeckPage = () => {
  const params = useParams<{ id: string; state: string }>();
  const deckId = params.id;
  const stater = params.state;
  const isCreateMode = stater === "state%3DcreateNewDeck";
  const isRenderDeckMode = stater === "%7Bstate%3D%22renderDeck%22%7D";

  const reduxDecks = useSelector((state: RootState) => state.deckStore.decks);
  const reduxCards = useSelector((state: RootState) => state.cardStore.cards);

  const decksQuery = useDecks();
  const deckQuery = useDeck(deckId);

  const decks = decksQuery.data ?? reduxDecks;
  const fallbackTitle = useMemo(() => basicDeckName(decks), [decks]);
  const apiDeck = !isCreateMode ? deckQuery.data : undefined;
  const reduxDeck = reduxDecks.find((deck) => deck.id === deckId);
  const currentDeck = apiDeck ?? reduxDeck ?? createFallbackDeck(deckId, fallbackTitle);

  return (
    <EditDeckForm
      key={`${currentDeck.id}-${currentDeck.updatedAt}`}
      currentDeck={currentDeck}
      deckId={deckId}
      isCreateMode={isCreateMode}
      isRenderDeckMode={isRenderDeckMode}
      initialCards={reduxCards}
    />
  );
};

export default EditDeckPage;