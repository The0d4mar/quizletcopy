import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  createDeck as createDeckInApi,
  deleteDeck as deleteDeckInApi,
  getDecks as fetchDecksFromApi,
  updateDeck as updateDeckInApi,
} from "@/lib/api/decksApi";
import { Deck } from "@/types/types.type";
import type { RootState } from "./store";

interface DeckState {
  decks: Deck[];
  syncStatus?: "idle" | "loading" | "ready" | "fallback";
  error?: string;
}

const upsertDeck = (decks: Deck[], deckToSave: Deck) => {
  const exists = decks.some((deck) => deck.id === deckToSave.id);

  if (!exists) {
    return [...decks, deckToSave];
  }

  return decks.map((deck) => (deck.id === deckToSave.id ? deckToSave : deck));
};

const withUpdatedAt = (deck: Deck): Deck => ({
  ...deck,
  updatedAt: new Date().toISOString(),
});

const initialState: DeckState = {
  decks: [],
  syncStatus: "idle",
};

export const syncDecksWithApi = createAsyncThunk<
  Deck[],
  void,
  { state: RootState; rejectValue: string }
>("decks/syncWithApi", async (_, { rejectWithValue }) => {
  try {
    return await fetchDecksFromApi();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Deck API is unavailable");
  }
});

export const saveDeckToApi = createAsyncThunk<Deck, Deck, { state: RootState }>(
  "decks/saveToApi",
  async (deck, { getState }) => {
    const deckToSave = withUpdatedAt(deck);
    const exists = getState().deckStore.decks.some((item) => item.id === deck.id);

    return exists ? await updateDeckInApi(deckToSave) : await createDeckInApi(deckToSave);
  },
);

export const deleteDeckFromApi = createAsyncThunk<string, string>(
  "decks/deleteFromApi",
  async (deckId) => {
    await deleteDeckInApi(deckId);
    return deckId;
  },
);

const deckStore = createSlice({
  name: "decks",
  initialState,
  reducers: {
    hydrateDecks(state, action: PayloadAction<Deck[]>) {
      state.decks = action.payload;
      state.syncStatus = "ready";
      state.error = undefined;
    },

    setDecks(state, action: PayloadAction<Deck[]>) {
      state.decks = action.payload;
    },

    pushDeck(state, action: PayloadAction<Deck>) {
      state.decks.push(action.payload);
    },

    delDecks(state, action: PayloadAction<string>) {
      state.decks = state.decks.filter((deck) => deck.id !== action.payload);
    },

    changeDeck(state, action: PayloadAction<Deck>) {
      state.decks = state.decks.map((deck) =>
        deck.id === action.payload.id ? action.payload : deck,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncDecksWithApi.pending, (state) => {
        state.syncStatus = "loading";
        state.error = undefined;
      })
      .addCase(syncDecksWithApi.fulfilled, (state, action) => {
        state.decks = action.payload;
        state.syncStatus = "ready";
        state.error = undefined;
      })
      .addCase(syncDecksWithApi.rejected, (state, action) => {
        state.syncStatus = "fallback";
        state.error = action.payload ?? action.error.message;
      })
      .addCase(saveDeckToApi.fulfilled, (state, action) => {
        state.decks = upsertDeck(state.decks, action.payload);
      })
      .addCase(deleteDeckFromApi.fulfilled, (state, action) => {
        state.decks = state.decks.filter((deck) => deck.id !== action.payload);
      });
  },
});

export const { hydrateDecks, setDecks, pushDeck, delDecks, changeDeck } = deckStore.actions;
export default deckStore.reducer;