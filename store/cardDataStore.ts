import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardData } from '@/types/type';
import { saveCardData, loadCardData } from '@/storage';

type CardDataState = {
  cardData: CardData[];
};

const initialState: CardDataState = {
  cardData: typeof window !== 'undefined' ? loadCardData() : [],
};

const cardDataStore = createSlice({
  name: 'cardData',
  initialState,
  reducers: {
    setCardData(state, action: PayloadAction<CardData[]>) {
      state.cardData = action.payload;
      saveCardData(state.cardData);
    },
  },
});

export const { setCardData } = cardDataStore.actions;

export default cardDataStore.reducer;