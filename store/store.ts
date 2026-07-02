import { configureStore } from "@reduxjs/toolkit";

import AddDeckToFolderStore from "./AddDeckToFolderStore";
import EditFolderName from "./EditFolderName";
import addFolderStore from "./addFolderStore";
import { apiPersistenceMiddleware } from "./apiPersistenceMiddleware";
import cardDataReducer from "./cardDataStore";
import cardStore from "./cardStore";
import deckStore from "./deckStore";
import folderStore from "./folderStore";
import modalReducer from "./modalStore";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    folderFlag: addFolderStore,
    folders: folderStore,
    adddecktofolderflag: AddDeckToFolderStore,
    folderChangeNameFlag: EditFolderName,
    deckStore: deckStore,
    cardStore: cardStore,
    cardDataStore: cardDataReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(apiPersistenceMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;