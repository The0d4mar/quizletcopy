
import { saveDecks } from "@/storage";
import { Card, Deck } from "@/types/type";




export const addNewDeck = (decks: Deck[]) => {

    const collectionDecks = decks.filter(deck =>
      deck.title.startsWith('Новая коллекция')
    );

    const newDeckTitle =
      collectionDecks.length === 0
        ? 'Новая коллекция'
        : `Новая коллекция ${collectionDecks.length + 1}`;

      const id = crypto.randomUUID()
      const newDeck: Deck = {
        id: id,
        title: newDeckTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        public: false,
        createdBy: "User",
      };

        const updatedDecks = [...decks, newDeck];
        saveDecks(updatedDecks);
        return id;
  };


export const delCenDeck = (decks: Deck[], deckId: string) =>{
    const newDecks = decks.filter(deck => deck.id != deckId)
    saveDecks(newDecks)
  }
