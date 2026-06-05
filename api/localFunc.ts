
import { loadCards, loadDecks, loadFolders, saveCards, saveDecks, saveFolders } from "@/storage";
import { Card, Deck, Folder } from "@/types/type";




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

  export const delConnectedCards = (cards: Card[], deletedDeckId: string) => {
    const newCards = cards.filter(card => card.deckId !== deletedDeckId)
    
    saveCards(newCards)
  }

  export const updateFolderList = (deckId: string) => {
    const folders = loadFolders();

    const updatedFolders = folders.map(folder => {
      if (folder.deckIds.includes(deckId)) {
        return {
          ...folder,
          deckIds: folder.deckIds.filter(id => id !== deckId),
        };
      }

      return folder;
    });
    saveFolders(updatedFolders);
    return updatedFolders;
  }
export const connectedDecks = (
  sendedDeckId: string,
  joinedDeckId: string
) => {
  const cards = loadCards();

  const updatedCards = cards.map(card => {
    if (card.deckId === joinedDeckId) {
      return {
        ...card,
        deckId: sendedDeckId,
        updatedAt: new Date().toISOString(),
      };
    }

    return card;
  });

  delCenDeck(loadDecks(), joinedDeckId);
  saveCards(updatedCards);
  return updatedCards;
};

export const delFolder = (folderId: string) => {
  const folders = loadFolders();
  const updatedFolders = folders.filter(folder => folder.id !== folderId);
  saveFolders(updatedFolders);
  return updatedFolders;
}