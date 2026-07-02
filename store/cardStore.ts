import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getCards as fetchCardsFromApi } from "@/lib/api/cardsApi";
import { Card } from "@/types/types.type";
import type { RootState } from "./store";

interface CardState {
  cards: Card[];
  syncStatus?: "idle" | "loading" | "ready" | "fallback";
  error?: string;
}

const initialState: CardState = {
  cards: [],
  syncStatus: "idle",
};

export const syncCardsWithApi = createAsyncThunk<
  Card[],
  void,
  { state: RootState; rejectValue: string }
>("cards/syncWithApi", async (_, { getState, rejectWithValue }) => {
  try {
    return await fetchCardsFromApi(getState().deckStore.decks);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Card API is unavailable");
  }
});

const cardStore = createSlice({
  name: "cards",
  initialState,
  reducers: {
    hydrateCards(state, action: PayloadAction<Card[]>) {
      state.cards = action.payload;
      state.syncStatus = "ready";
      state.error = undefined;
    },

    setUpdatedCards(state, action: PayloadAction<Card[]>) {
      state.cards = action.payload;
    },

    addCard(state, action: PayloadAction<Card>) {
      state.cards.push(action.payload);
    },

    delCard(state, action: PayloadAction<Card>) {
      const delId = action.payload.id;
      state.cards = state.cards.filter((card) => card.id !== delId);
    },

    changeCard(state, action: PayloadAction<Card>) {
      const changedId = action.payload.id;
      state.cards = state.cards.map((card) => (card.id === changedId ? action.payload : card));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCardsWithApi.pending, (state) => {
        state.syncStatus = "loading";
        state.error = undefined;
      })
      .addCase(syncCardsWithApi.fulfilled, (state, action) => {
        state.cards = action.payload;
        state.syncStatus = "ready";
        state.error = undefined;
      })
      .addCase(syncCardsWithApi.rejected, (state, action) => {
        state.syncStatus = "fallback";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { hydrateCards, setUpdatedCards, addCard, delCard, changeCard } = cardStore.actions;
export default cardStore.reducer;