import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { persistCardsToApi } from "@/features/cards/api";
import { persistFoldersToApi } from "@/features/folders/api";
import { persistProgressToApi } from "@/features/progress/api";
import { addCard, changeCard, delCard, setUpdatedCards } from "./cardStore";
import { setCardData } from "./cardDataStore";
import { addFolder, createFolderCopy, deleteFolder, setFolders } from "./folderStore";
import type { RootState } from "./store";

export const apiPersistenceMiddleware = createListenerMiddleware();

apiPersistenceMiddleware.startListening({
  matcher: isAnyOf(setUpdatedCards, addCard, delCard, changeCard),
  effect: async (_action, listenerApi) => {
    if (process.env.NODE_ENV === "test") return;

    const previousState = listenerApi.getOriginalState() as RootState;
    const currentState = listenerApi.getState() as RootState;

    await persistCardsToApi(currentState.cardStore.cards, previousState.cardStore.cards);
  },
});

apiPersistenceMiddleware.startListening({
  matcher: isAnyOf(setFolders, addFolder, deleteFolder, createFolderCopy),
  effect: async (_action, listenerApi) => {
    if (process.env.NODE_ENV === "test") return;

    const previousState = listenerApi.getOriginalState() as RootState;
    const currentState = listenerApi.getState() as RootState;

    await persistFoldersToApi(currentState.folders.folders, previousState.folders.folders);
  },
});

apiPersistenceMiddleware.startListening({
  actionCreator: setCardData,
  effect: async (_action, listenerApi) => {
    if (process.env.NODE_ENV === "test") return;

    const previousState = listenerApi.getOriginalState() as RootState;
    const currentState = listenerApi.getState() as RootState;

    await persistProgressToApi(currentState.cardDataStore.cardData, previousState.cardDataStore.cardData);
  },
});
