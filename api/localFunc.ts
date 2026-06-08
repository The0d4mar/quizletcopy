
import { loadCards, loadDecks, loadFolders, saveCards, saveDecks, saveFolders } from "@/storage";
import { Card, Deck, Folder } from "@/types/type";
import { LibraryItem, SortType, GroupedLibraryItems, EntityFilter } from '@/types/type';



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

export const basicDeckName = () =>{
  const decksTitles = loadDecks().map(deck => deck.title);
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
    newDeckTitle = `Новая коллекция ${lastNum + 1}`;
  }
  return newDeckTitle
}

export const addNewDeck = (decks: Deck[]) :[string, Deck] => {
      const newDeckTitle = basicDeckName()
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

        return [id, newDeck];
  };


export const delCenDeck = (decks: Deck[], deckId: string) =>{
    const newDecks = decks.filter(deck => deck.id != deckId)
    return newDecks
    
  }

  export const delConnectedCards = (cards: Card[], deletedDeckId: string) => {
    const newCards = cards.filter(card => card.deckId !== deletedDeckId)
    
    return newCards
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
) : [Card[], Deck[]] => {
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

  const newDecks = delCenDeck(loadDecks(), joinedDeckId);
  return [updatedCards, newDecks];
};

export const delFolder = (folderId: string) => {
  const folders = loadFolders();
  const updatedFolders = folders.filter(folder => folder.id !== folderId);
  saveFolders(updatedFolders);
  return updatedFolders;
}

export const addNewCard = (deckId: string) => {
  const newCard: Card = {
      id: crypto.randomUUID(),
      deckId,
      original: '',
      translation: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return newCard
}


const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export function isSameDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function isThisWeek(date: Date): boolean {
  const now = new Date();

  const currentDay = now.getDay() || 7;
  const monday = new Date(now);

  monday.setDate(now.getDate() - currentDay + 1);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);

  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return date >= monday && date <= sunday && !isSameDay(date, now);
}

export function getSortDate(item: LibraryItem, sortType: SortType): string {
  if (sortType === 'created') return item.createdAt;
  if (sortType === 'updated') return item.updatedAt;

  return item.viewedAt ?? item.updatedAt;
}

export function getGroupTitle(item: LibraryItem, sortType: SortType): string {
  const date = new Date(getSortDate(item, sortType));
  const today = new Date();

  if (isSameDay(date, today)) return 'Сегодня';

  if (isThisWeek(date)) return 'На этой неделе';

  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}


export function createLibraryItems(
  decks: Deck[],
  cards: Card[],
  folders: Folder[]
): LibraryItem[] {
  const deckItems: LibraryItem[] = decks.map(deck => ({
    type: 'deck',
    id: deck.id,
    title: deck.title,
    createdAt: deck.createdAt,
    updatedAt: deck.updatedAt,
    viewedAt: deck.lastRepeat,
    cardsCount: cards.filter(card => card.deckId === deck.id).length,
    href: `/deck/${deck.id}`,
  }));

  const folderItems: LibraryItem[] = folders.map(folder => ({
    type: 'folder',
    id: folder.id,
    title: folder.title,
    createdAt: folder.createdAt,
    updatedAt: folder.updatedAt,
    viewedAt: folder.updatedAt,
    modulesCount: folder.deckIds.length,
    href: `/folders/${folder.id}`,
  }));

  return [...deckItems, ...folderItems];
}


export function filterLibraryItems(
  items: LibraryItem[],
  entityFilter: EntityFilter,
  searchValue: string,
  sortType: SortType
): LibraryItem[] {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return items
    .filter(item => {
      if (entityFilter === 'decks') return item.type === 'deck';
      if (entityFilter === 'folders') return item.type === 'folder';

      return true;
    })
    .filter(item => item.title.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => {
      const dateA = new Date(getSortDate(a, sortType)).getTime();
      const dateB = new Date(getSortDate(b, sortType)).getTime();

      return dateB - dateA;
    });
}

export function groupLibraryItems(
  items: LibraryItem[],
  sortType: SortType
): GroupedLibraryItems {
  return items.reduce<GroupedLibraryItems>((acc, item) => {
    const groupTitle = getGroupTitle(item, sortType);

    if (!acc[groupTitle]) {
      acc[groupTitle] = [];
    }

    acc[groupTitle].push(item);

    return acc;
  }, {});
}