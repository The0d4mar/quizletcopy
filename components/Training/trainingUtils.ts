import { Card } from '@/types/types.type';
import {
  CardData,
  LearnQuestionData,
  MatchQuestionData,
  QuestionSide,
  TestQuestionData,
  TestQuestionType,
  WriteQuestionData,
} from '@/types/types.type';

export const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};


export const getCardQuestion = (
  card: Card,
  questionSide: QuestionSide
): string => {
  return questionSide === 'original'
    ? card.original
    : card.translation;
};

export const getCardAnswer = (
  card: Card,
  questionSide: QuestionSide
): string => {
  return questionSide === 'original'
    ? card.translation
    : card.original;
};

export const createAnswers = (
  currentCard: Card,
  cards: Card[],
  questionSide: QuestionSide
): string[] => {
  const correctAnswer = getCardAnswer(currentCard, questionSide);

  const wrongAnswers = cards
    .filter(card => card.id !== currentCard.id)
    .map(card => getCardAnswer(card, questionSide))
    .filter(Boolean);

  const uniqueWrongAnswers = Array.from(new Set(wrongAnswers));

  return shuffleArray([
    correctAnswer,
    ...shuffleArray(uniqueWrongAnswers).slice(0, 3),
  ]);
};

export const createChoiceQuestion = (
  card: Card,
  cards: Card[],
  questionSide: QuestionSide
): LearnQuestionData => {
  return {
    type: 'choice',
    card,
    question: getCardQuestion(card, questionSide),
    correctAnswer: getCardAnswer(card, questionSide),
    answers: createAnswers(card, cards, questionSide),
  };
};

export const createWriteQuestion = (
  card: Card,
  questionSide: QuestionSide
): WriteQuestionData => {
  return {
    type: 'write',
    card,
    question: getCardQuestion(card, questionSide),
    correctAnswer: getCardAnswer(card, questionSide),
  };
};



export const createLearnQuestions = (
  cards: Card[],
  questionSide: QuestionSide
): LearnQuestionData[] => {
  return cards.map(card =>
    createChoiceQuestion(card, cards, questionSide)
  );
};


export const normalizeAnswer = (value: string): string => {
  return value.trim().toLowerCase();
};

export const updateCardDataCorrect = (
  cardDataList: CardData[],
  cardId: string
): CardData[] => {
  const now = new Date().toISOString();

  const currentData = cardDataList.find(data => data.cardId === cardId);

  if (!currentData) {
    return [
      ...cardDataList,
      {
        id: crypto.randomUUID(),
        cardId,
        numOfRepeats: 1,
        wrongRepeats: 0,
        lastRepeat: [now],
      },
    ];
  }

  return cardDataList.map(data =>
    data.cardId === cardId
      ? {
          ...data,
          numOfRepeats: data.numOfRepeats + 1,
          lastRepeat: [...data.lastRepeat, now],
        }
      : data
  );
};

export const updateCardDataWrong = (
  cardDataList: CardData[],
  cardId: string
): CardData[] => {
  const currentData = cardDataList.find(data => data.cardId === cardId);

  if (!currentData) {
    return [
      ...cardDataList,
      {
        id: crypto.randomUUID(),
        cardId,
        numOfRepeats: 0,
        wrongRepeats: 1,
        lastRepeat: [],
      },
    ];
  }

  return cardDataList.map(data =>
    data.cardId === cardId
      ? {
          ...data,
          wrongRepeats: data.wrongRepeats + 1,
        }
      : data
  );
};

export const getRandomInt = (
  min: number,
  max: number
): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const createMatchQuestion = (
  cards: Card[]
): MatchQuestionData => {
  const maxPairs = Math.min(8, cards.length);
  const minPairs = Math.min(3, maxPairs);

  const pairsCount = getRandomInt(minPairs, maxPairs);

  const selectedCards = shuffleArray(cards).slice(0, pairsCount);

  return {
    type: 'match',
    id: crypto.randomUUID(),
    cards: selectedCards,
    shuffledCards: shuffleArray(selectedCards),
  };
};

export const createTestQuestions = (
  cards: Card[],
  questionSide: QuestionSide,
  questionTypes: TestQuestionType[]
): TestQuestionData[] => {
  const questions: TestQuestionData[] = [];

  const shuffledCards = shuffleArray(cards);

  shuffledCards.forEach(card => {
    if (questionTypes.includes('choice')) {
      questions.push(createChoiceQuestion(card, cards, questionSide));
    }

    if (questionTypes.includes('write')) {
      questions.push(createWriteQuestion(card, questionSide));
    }
  });

  if (questionTypes.includes('match') && cards.length >= 3) {
    questions.push(createMatchQuestion(cards));
  }

  return shuffleArray(questions);
};