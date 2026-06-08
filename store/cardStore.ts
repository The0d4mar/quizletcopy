import { loadCards, loadDecks, saveCards, saveDecks } from "@/storage";
import { Card, Deck } from "@/types/type"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";
import { useSelector } from "react-redux";

interface DeckState {
    cards: Card[]
}

const initialState: DeckState = {
  cards: typeof window !== 'undefined' ? loadCards() : [],
};

const CardStore = createSlice({
    name: 'cards',
    initialState,
    reducers: {
        setUpdatedCards(state, action: PayloadAction<Card[]>){
            state.cards = action.payload
            saveCards(state.cards)
        },

        addCard(state, action: PayloadAction<Card>){
            state.cards.push(action.payload)
            saveCards(state.cards)
        },
        delCard(state, action: PayloadAction<Card>){
            const delId = action.payload.id;
            state.cards = state.cards.filter(deck => deck.id != delId)
            saveCards(state.cards)
        },
        changeCard(state, action: PayloadAction<Card>){
            const changedId = action.payload.id;
            state.cards = state.cards.map(cards => cards.id == changedId ? action.payload : cards )
            saveCards(state.cards)
        }
    }
})


export const { setUpdatedCards, addCard, delCard, changeCard} = CardStore.actions;
export default CardStore.reducer;