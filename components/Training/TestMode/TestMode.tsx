'use client'

import { setCardData } from '@/store/cardDataStore';
import { RootState } from '@/store/store';
import { Card } from '@/types/type';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TrainingResult, { TrainingMistake } from '../TrainingResult/TrainingResult';
import {
  createTestQuestions,
  normalizeAnswer,
  updateCardDataCorrect,
  updateCardDataWrong,
} from '../trainingUtils';
import {
  AnswerStatus,
  QuestionSide,
  TestQuestionType,
} from '@/types/type';
import TestSetupModal from './TestSetupModal';
import TestChoiceQuestion from './TestChoiceQuestion';
import TestWriteQuestion from './TestWriteQuestion';
import TestMatchQuestion from './TestMatchQuestion';

interface TestModeProps {
  deckTitle: string;
  deckCards: Card[];
  onExit: () => void;
}

const TestMode = ({
  deckTitle,
  deckCards,
  onExit,
}: TestModeProps) => {
  const dispatch = useDispatch();

  const cardData = useSelector(
    (state: RootState) => state.cardDataStore.cardData
  );

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const [questionSide, setQuestionSide] = useState<QuestionSide>('original');
  const [questionTypes, setQuestionTypes] = useState<TestQuestionType[]>([
    'choice',
    'match',
    'write',
  ]);

  const [questionsCount, setQuestionsCount] = useState(
    Math.min(deckCards.length, 20)
  );

  const [answersState, setAnswersState] = useState<
    Record<string, { selectedAnswer: string; status: AnswerStatus }>
  >({});

  const [mistakes, setMistakes] = useState<TrainingMistake[]>([]);

  const questions = useMemo(() => {
    return createTestQuestions(
      deckCards,
      questionSide,
      questionTypes
    ).slice(0, questionsCount);
  }, [deckCards, questionSide, questionTypes, questionsCount]);

  const getQuestionId = (index: number) => {
    const question = questions[index];

    if (!question) return String(index);

    if (question.type === 'match') {
      return question.id;
    }

    return `${question.type}-${question.card.id}-${index}`;
  };

  const correctCount = Object.values(answersState).filter(
    answer => answer.status === 'correct'
  ).length;

  const wrongCount = Object.values(answersState).filter(
    answer => answer.status === 'wrong'
  ).length;

  const saveCorrect = (cardId: string) => {
    dispatch(setCardData(updateCardDataCorrect(cardData, cardId)));
  };

  const saveWrong = (cardId: string) => {
    dispatch(setCardData(updateCardDataWrong(cardData, cardId)));
  };

  const answerChoice = (
    index: number,
    answer: string
  ) => {
    const question = questions[index];

    if (!question || question.type !== 'choice') return;

    const questionId = getQuestionId(index);

    if (answersState[questionId]) return;

    const isCorrect = answer === question.correctAnswer;

    setAnswersState(prev => ({
      ...prev,
      [questionId]: {
        selectedAnswer: answer,
        status: isCorrect ? 'correct' : 'wrong',
      },
    }));

    if (isCorrect) {
      saveCorrect(question.card.id);
    } else {
      saveWrong(question.card.id);

      setMistakes(prev => [
        ...prev,
        {
          card: question.card,
          selectedAnswer: answer,
          correctAnswer: question.correctAnswer,
        },
      ]);
    }
  };

  const answerWrite = (
    index: number,
    answer: string
  ) => {
    const question = questions[index];

    if (!question || question.type !== 'write') return;

    const questionId = getQuestionId(index);

    if (answersState[questionId]) return;

    const isCorrect =
      normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer);

    setAnswersState(prev => ({
      ...prev,
      [questionId]: {
        selectedAnswer: answer,
        status: isCorrect ? 'correct' : 'wrong',
      },
    }));

    if (isCorrect) {
      saveCorrect(question.card.id);
    } else {
      saveWrong(question.card.id);

      setMistakes(prev => [
        ...prev,
        {
          card: question.card,
          selectedAnswer: answer,
          correctAnswer: question.correctAnswer,
        },
      ]);
    }
  };

  const answerMatch = (
    index: number,
    isCorrect: boolean,
    wrongCardIds: string[]
  ) => {
    const question = questions[index];

    if (!question || question.type !== 'match') return;

    const questionId = getQuestionId(index);

    if (answersState[questionId]) return;

    setAnswersState(prev => ({
      ...prev,
      [questionId]: {
        selectedAnswer: isCorrect ? 'Все сопоставлено верно' : 'Есть ошибки',
        status: isCorrect ? 'correct' : 'wrong',
      },
    }));

    question.cards.forEach(card => {
      if (wrongCardIds.includes(card.id)) {
        saveWrong(card.id);

        setMistakes(prev => [
          ...prev,
          {
            card,
            selectedAnswer: 'Ошибка в сопоставлении',
            correctAnswer: card.translation,
          },
        ]);
      } else {
        saveCorrect(card.id);
      }
    });
  };

  const restartTest = () => {
    setAnswersState({});
    setMistakes([]);
    setFinished(false);
    setStarted(false);
  };

  if (!started) {
    return (
      <TestSetupModal
        deckTitle={deckTitle}
        maxQuestions={deckCards.length}
        questionsCount={questionsCount}
        questionTypes={questionTypes}
        onQuestionsCountChange={setQuestionsCount}
        onQuestionTypesChange={setQuestionTypes}
        onSelectSide={setQuestionSide}
        onStart={() => setStarted(true)}
        onClose={onExit}
      />
    );
  }

  if (finished) {
    return (
      <TrainingResult
        deckTitle={deckTitle}
        correctCount={correctCount}
        wrongCount={wrongCount}
        mistakes={mistakes}
        onRestart={restartTest}
        onExit={onExit}
      />
    );
  }

  const answeredCount = Object.keys(answersState).length;

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-[var(--block-gap)]">
      <div className="text-center">
        <p className="font-bold text-[var(--color-text-muted)]">
          {deckTitle}
        </p>

        <p className="font-bold">
          {answeredCount} / {questions.length}
        </p>
      </div>

      {questions.map((question, index) => {
        const questionId = getQuestionId(index);
        const answerState = answersState[questionId];

        if (question.type === 'choice') {
          return (
            <TestChoiceQuestion
              key={questionId}
              question={question}
              index={index}
              total={questions.length}
              selectedAnswer={answerState?.selectedAnswer ?? null}
              answerStatus={answerState?.status ?? 'idle'}
              onSelectAnswer={answer => answerChoice(index, answer)}
            />
          );
        }

        if (question.type === 'write') {
          return (
            <TestWriteQuestion
              key={questionId}
              question={question}
              index={index}
              total={questions.length}
              selectedAnswer={answerState?.selectedAnswer ?? null}
              answerStatus={answerState?.status ?? 'idle'}
              onSubmitAnswer={answer => answerWrite(index, answer)}
            />
          );
        }

        return (
          <TestMatchQuestion
            key={questionId}
            question={question}
            index={index}
            total={questions.length}
            answerStatus={answerState?.status ?? 'idle'}
            onFinishMatch={(isCorrect, wrongCardIds) =>
              answerMatch(index, isCorrect, wrongCardIds)
            }
          />
        );
      })}

      <div className="sticky bottom-6 flex justify-center">
        <button
          type="button"
          disabled={answeredCount !== questions.length}
          onClick={() => setFinished(true)}
          className="custom-btn rounded-[var(--radius-button)] bg-[var(--color-focus)] disabled:opacity-40"
        >
          Завершить тест
        </button>
      </div>
    </div>
  );
};

export default TestMode;