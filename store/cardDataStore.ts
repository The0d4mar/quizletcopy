import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getProgress as fetchProgressFromApi } from "@/lib/api/progressApi";
import { CardData, CardDataState } from "@/types/types.type";
import type { RootState } from "./store";

interface CardProgressState extends CardDataState {
  syncStatus?: "idle" | "loading" | "ready" | "fallback";
  error?: string;
}

const initialState: CardProgressState = {
  cardData: [],
  syncStatus: "idle",
};

export const syncProgressWithApi = createAsyncThunk<
  CardData[],
  void,
  { state: RootState; rejectValue: string }
>("cardData/syncWithApi", async (_, { rejectWithValue }) => {
  try {
    return await fetchProgressFromApi();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Progress API is unavailable");
  }
});

const cardDataStore = createSlice({
  name: "cardData",
  initialState,
  reducers: {
    hydrateCardData(state, action: PayloadAction<CardData[]>) {
      state.cardData = action.payload;
      state.syncStatus = "ready";
      state.error = undefined;
    },

    setCardData(state, action: PayloadAction<CardData[]>) {
      state.cardData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncProgressWithApi.pending, (state) => {
        state.syncStatus = "loading";
        state.error = undefined;
      })
      .addCase(syncProgressWithApi.fulfilled, (state, action) => {
        state.cardData = action.payload;
        state.syncStatus = "ready";
        state.error = undefined;
      })
      .addCase(syncProgressWithApi.rejected, (state, action) => {
        state.syncStatus = "fallback";
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { hydrateCardData, setCardData } = cardDataStore.actions;
export default cardDataStore.reducer;