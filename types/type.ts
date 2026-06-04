import { LucideIcon } from "lucide-react";

export type Deck = {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    public: boolean;
}
export type Card = {
    id: string;
    deckId: string;
    original:string;
    translation: string;
    createdAt: string;
    updatedAt: string;
}

export type CardData = {
    id: string;
    cardId: string;
    numOfRepeats: number;
    lastRepeat: string;
}

export type Repeats = {
    id: string;
    dataOfRepeat: string[];
    numOfRepeats: number[];
}

export type Folder ={
    id: string;
    title: string;
    deckTitles: string[];
    deckIds: string[];
}

export type StorageSchema = {
  decks: Deck[];    
  cards: Card[];
  repeats: Repeats[];
  folders: Folder[];
};

//////////////////////////////////////////////////////

export interface DeckCardProps{
    deck: Deck,
    cardsCount: number,
}

export interface SideBarChapProps{
    id: string,
    title: string,
    headers: string[],
    icons: LucideIcon[],
}