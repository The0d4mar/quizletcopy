import { LucideIcon } from "lucide-react";

export type Deck = {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    public: boolean;
    lastRepeat: string;
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
  wrongRepeats: number;
  lastRepeat: string[];
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
    createdAt: string;
    updatedAt: string;
}

export type StorageSchema = {
  decks: Deck[];    
  cards: Card[];
  repeats: Repeats[];
  folders: Folder[];
};

//////////////////////////////////////////////////////

export type DeckCardProps = {
    deck: Deck;
    cardsCount: number;
}

export type SideBarChapProps = {
    id: string;
    title: string;
    headers: string[];
    icons: LucideIcon[];
    ways: string[];
}

export type SearchResult =
  | {
      type: 'deck';
      id: string;
      title: string;
      subtitle: string;
      href: string;
    }
  | {
      type: 'folder';
      id: string;
      title: string;
      subtitle: string;
      href: string;
    }
  | {
      type: 'card';
      id: string;
      title: string;
      subtitle: string;
      href: string;
    };

    ////////////////////////////////////////////////////

    export type LibraryItem =
  | {
      type: 'deck';
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      viewedAt?: string;
      cardsCount: number;
      href: string;
    }
  | {
      type: 'folder';
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      viewedAt?: string;
      modulesCount: number;
      href: string;
    };

export type EntityFilter = 'all' | 'decks' | 'folders';

export type SortType = 'created' | 'updated' | 'viewed';

export type GroupedLibraryItems = Record<string, LibraryItem[]>;



export type TrainingMode = 'cards' | 'learn' | 'test';

export type QuestionSide = 'original' | 'translation';

export type TestQuestionType = 'choice' | 'match' | 'write';

export type AnswerStatus = 'idle' | 'correct' | 'wrong';


export type LearnQuestionData = {
  type: 'choice';
  card: Card;
  question: string;
  correctAnswer: string;
  answers: string[];
};

export type MatchQuestionData = {
  type: 'match';
  id: string;
  cards: Card[];
};

export type WriteQuestionData = {
  type: 'write';
  card: Card;
  question: string;
  correctAnswer: string;
};

export type TestQuestionData =
  | LearnQuestionData
  | MatchQuestionData
  | WriteQuestionData;