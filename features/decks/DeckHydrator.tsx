'use client';

import { useEffect } from "react";

import { syncDecksWithApi } from "@/store/deckStore";
import { useAppDispatch } from "@/store/hooks";

const DeckHydrator = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(syncDecksWithApi());
  }, [dispatch]);

  return null;
};

export default DeckHydrator;
