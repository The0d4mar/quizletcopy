import { LucideIcon } from "lucide-react";

export interface Deck {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  ownerId?: string;
  public: boolean;
  lastRepeat: string;
  isStatsOpen?: boolean;
}

export interface Card {
  id: string;
  deckId: string;
  original: string;
  translation: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardData {
  id: string;
  cardId: string;
  numOfRepeats: number;
  wrongRepeats: number;
  lastRepeat: string[];
}

export interface Repeats {
  id: string;
  dataOfRepeat: string[];
  numOfRepeats: number[];
}

export interface Folder {
  id: string;
  title: string;
  deckTitles: string[];
  deckIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StorageSchema {
  decks: Deck[];
  cards: Card[];
  repeats: Repeats[];
  folders: Folder[];
}

export interface DeckCardProps {
  deck: Deck;
  cardsCount: number;
}

export interface SideBarChapProps {
  id: string;
  title: string;
  headers: string[];
  icons: LucideIcon[];
  ways: string[];
}

export interface DeckSearchResult {
  type: "deck";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface FolderSearchResult {
  type: "folder";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export interface CardSearchResult {
  type: "card";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export type SearchResult = DeckSearchResult | FolderSearchResult | CardSearchResult;

export interface DeckLibraryItem {
  type: "deck";
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  cardsCount: number;
  href: string;
}

export interface FolderLibraryItem {
  type: "folder";
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  viewedAt?: string;
  modulesCount: number;
  href: string;
}

export type LibraryItem = DeckLibraryItem | FolderLibraryItem;

export type EntityFilter = "all" | "decks" | "folders";

export type SortType = "created" | "updated" | "viewed";

export interface GroupedLibraryItems {
  [groupTitle: string]: LibraryItem[];
}

export type FlashcardFrontSide = "original" | "translation";

export type TrainingMode = "cards" | "learn" | "test";

export type QuestionSide = "original" | "translation";

export type TestQuestionType = "choice" | "match" | "write";

export type AnswerStatus = "idle" | "correct" | "wrong";

export interface LearnQuestionData {
  type: "choice";
  card: Card;
  question: string;
  correctAnswer: string;
  answers: string[];
}

export interface MatchQuestionData {
  type: "match";
  id: string;
  cards: Card[];
  shuffledCards: Card[];
}

export interface WriteQuestionData {
  type: "write";
  card: Card;
  question: string;
  correctAnswer: string;
}

export type TestQuestionData = LearnQuestionData | MatchQuestionData | WriteQuestionData;

export interface TrainingMistake {
  card: Card;
  selectedAnswer: string;
  correctAnswer: string;
}

export interface DeckStatsGroup {
  title: string;
  description: string;
  cards: Card[];
}

export type SlideDirection = "next" | "prev";

export interface WordCardProps {
  original: string;
  translation: string;
  flipped?: boolean;
}

export interface AppContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface SkeletonBlockProps {
  className?: string;
}

export interface CardDataState {
  cardData: CardData[];
}
