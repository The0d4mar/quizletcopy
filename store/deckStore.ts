import { loadDecks, saveDecks } from "@/storage";
import { Deck } from "@/types/type"
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeckState {
    decks: Deck[]
}

const initialState: DeckState = {
  decks: typeof window !== 'undefined' ? loadDecks() : [],
};

const deckStore = createSlice({
    name: 'decks',
    initialState,
    reducers: {
        setDecks(state, action: PayloadAction<Deck[]>){
            state.decks = action.payload
            saveDecks(state.decks)
        },

        pushDeck(state, action: PayloadAction<Deck>){
            state.decks.push(action.payload)
            saveDecks(state.decks)
        },
        delDecks(state, action: PayloadAction<string>){
            const delId = action.payload;
            state.decks = state.decks.filter(deck => deck.id != delId)
            saveDecks(state.decks)
        },
        changeDeck(state, action: PayloadAction<Deck>){
            const changedId = action.payload.id;
            state.decks = state.decks.map(deck => deck.id == changedId ? action.payload : deck )
            saveDecks(state.decks)
        }
    }
})


export const { setDecks, pushDeck, delDecks, changeDeck} = deckStore.actions;
export default deckStore.reducer;