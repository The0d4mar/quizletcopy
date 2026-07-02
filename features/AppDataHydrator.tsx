"use client";

import { useEffect } from "react";

import { useCards } from "@/features/cards/useCards";
import { useDecks } from "@/features/decks/useDecks";
import { useFolders } from "@/features/folders/useFolders";
import { useProgress } from "@/features/progress/useProgress";
import { hydrateCardData } from "@/store/cardDataStore";
import { hydrateCards } from "@/store/cardStore";
import { hydrateDecks } from "@/store/deckStore";
import { hydrateFolders } from "@/store/folderStore";
import { useAppDispatch } from "@/store/hooks";

const AppDataHydrator = () => {
  const dispatch = useAppDispatch();
  const decksQuery = useDecks();
  const cardsQuery = useCards(decksQuery.data ?? []);
  const foldersQuery = useFolders();
  const progressQuery = useProgress();

  useEffect(() => {
    if (decksQuery.data) {
      dispatch(hydrateDecks(decksQuery.data));
    }
  }, [decksQuery.data, dispatch]);

  useEffect(() => {
    if (cardsQuery.data) {
      dispatch(hydrateCards(cardsQuery.data));
    }
  }, [cardsQuery.data, dispatch]);

  useEffect(() => {
    if (foldersQuery.data) {
      dispatch(hydrateFolders(foldersQuery.data));
    }
  }, [foldersQuery.data, dispatch]);

  useEffect(() => {
    if (progressQuery.data) {
      dispatch(hydrateCardData(progressQuery.data));
    }
  }, [progressQuery.data, dispatch]);

  return null;
};

export default AppDataHydrator;