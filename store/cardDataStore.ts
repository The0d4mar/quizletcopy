import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardData, CardDataState } from '@/types/types.type';
import { saveCardData, loadCardData } from '@/storage';


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