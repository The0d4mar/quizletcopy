
import { Card, Deck, Folder } from "@/types/type";
import { LibraryItem, SortType, GroupedLibraryItems, EntityFilter } from '@/types/type';
import { monthNames } from "./DataBlock";



export const updateDeckLastRepeat = (
  decks: Deck[],
  deckId: string
): Deck[] => {
  return decks.map(deck =>
    deck.id === deckId
      ? {
          ...deck,
          lastRepeat:
            new Date().toISOString(),
        }
      : deck
  );
};

export const basicDeckName = (
  decks: Deck[]
): string => {
  const baseName = 'Новая коллекция';

  const titles = decks.map(deck =>
    deck.title.trim()
  );

  // 1. Проверяем базовое имя без цифры
  const hasBaseDeck =
    titles.includes(baseName);

  if (!hasBaseDeck) {
    return baseName;
  }

  // 2. Собираем все номера
  const usedNumbers = new Set<number>();

  titles.forEach(title => {
    const match = title.match(
      /^Новая коллекция\s+(\d+)$/
    );

    if (match) {
      usedNumbers.add(Number(match[1]));
    }
  });

  // 3. Ищем первую свободную цифру
  let nextNumber = 1;

  while (usedNumbers.has(nextNumber)) {
    nextNumber++;
  }

  return `${baseName} ${nextNumber}`;
};



export const delCenDeck = (decks: Deck[], deckId: string) =>{
    const newDecks = decks.filter(deck => deck.id != deckId)
    return newDecks
    
  }


  
export const connectedDecks = (
  sendedDeckId: string,
  joinedDeckId: string,
  cards: Card[],
  decks: Deck[]
) : [Card[], Deck[]] => {

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

  const newDecks = delCenDeck(decks, joinedDeckId);
  return [updatedCards, newDecks];
};

export const removeDeckFromFolders = (
  folders: Folder[],
  deckId: string
): Folder[] => {
  return folders.map(folder => {
    if (!folder.deckIds.includes(deckId)) {
      return folder;
    }

    return {
      ...folder,
      deckIds: folder.deckIds.filter(id => id !== deckId),
      updatedAt: new Date().toISOString(),
    };
  });
};

export const delFolder = (folders: Folder[], folderId: string) => {
  const updatedFolders = folders.filter(folder => folder.id !== folderId);
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

export const delConnectedCards = (cards: Card[], deletedDeckId: string) => {
  const newCards = cards.filter(card => card.deckId !== deletedDeckId)
  
  return newCards
}
////////////////////////////////////////////////////////////////////////////////


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