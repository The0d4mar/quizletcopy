
import { loadCards, loadDecks, loadFolders, saveCards, saveDecks, saveFolders } from "@/storage";
import { Card, Deck, Folder } from "@/types/type";


export const changeDeckLastRepeat = (deckId: string) => {
  const decks = loadDecks();

  const updatedDecks = decks.map(deck => {
    if (deck.id === deckId) {
      return {
        ...deck,
        lastRepeat: new Date().toISOString(),
      };
    }
    return deck;
  });

  saveDecks(updatedDecks);
};

export const addNewDeck = (decks: Deck[]) => {
  const decksTitles = decks.map(deck => deck.title);
  let newDeckTitle = '';
  
    const newDeckCTitleNames = decksTitles.filter(title => title.startsWith('Новая коллекция'));
    console.log(decksTitles, newDeckCTitleNames)
    if(newDeckCTitleNames.length === 0){
      newDeckTitle = 'Новая коллекция';
    }
    else{
      newDeckCTitleNames.sort((a, b) => {
        const numA = parseInt(a.replace('Новая коллекция ', '')) || 0;
        const numB = parseInt(b.replace('Новая коллекция ', '')) || 0;
        return numA - numB;
      });
      const lastNewDeckTitle = newDeckCTitleNames[newDeckCTitleNames.length - 1];
      const lastNum = parseInt(lastNewDeckTitle.replace('Новая коллекция ', '')) || 0;
      console.log(newDeckCTitleNames, lastNewDeckTitle, lastNum)
      newDeckTitle = `Новая коллекция ${lastNum + 1}`;
    }



      const id = crypto.randomUUID()
      const newDeck: Deck = {
        id: id,
        title: newDeckTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        public: false,
        createdBy: "User",
        lastRepeat: new Date().toISOString(),
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