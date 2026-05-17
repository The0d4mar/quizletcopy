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

export type StorageSchema = {
  decks: Deck[];    
  cards: Card[];
  repeats: Repeats[];
};

//////////////////////////////////////////////////////

export interface DeckCardProps{
    deck: Deck,
    cardsCount: number,
}

export interface SideBarChapProps{
    title: string,
    headers: string[],
    icons: LucideIcon[],
}