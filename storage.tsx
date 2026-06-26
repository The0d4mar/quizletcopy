'use client'

import { Card, Deck, Folder, StorageSchema, CardData } from "./types/types.type";


export const STORAGE_KEY = "quiz-app-data";
export const CARDS_KEY = "quiz-app:cards";
export const FOLDERS_KEY = "quiz-app:folders";
export const CARD_DATA_KEY = 'cardData';

const defaultData: StorageSchema = {
    decks: [],
    cards: [],
    repeats: [],
    folders: [],
};

export const storage = {
  load(): StorageSchema {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultData;
    }

    try {
      return JSON.parse(raw) as StorageSchema;
    } catch (error) {
      console.error("Ошибка чтения localStorage:", error);
      return defaultData;
    }
  },

  save(data: StorageSchema): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Ошибка записи в localStorage:", error);
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};  



export function loadDecks(): Deck[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as Deck[];
  } catch {
    return [];
  }
}

export function saveDecks(decks: Deck[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}


export function loadCards(): Card[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = localStorage.getItem(CARDS_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}


export function saveCards(cards: Card[]): void {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
};

export function loadFolders(): Folder[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = localStorage.getItem(FOLDERS_KEY);

  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed.filter(Boolean);
  } catch {
    return [];
  }

}

export function saveFolders(folders: Folder[]): void {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}




export function loadCardData(): CardData[] {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem(CARD_DATA_KEY);

  if (!raw) return [];

  try {
    return JSON.parse(raw) as CardData[];
  } catch {
    return [];
  }
}

export function saveCardData(cardData: CardData[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(CARD_DATA_KEY, JSON.stringify(cardData));
}