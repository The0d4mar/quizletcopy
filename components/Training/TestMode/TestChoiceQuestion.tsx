'use client'

import { AnswerStatus, LearnQuestionData } from '@/types/types.type';

interface TestChoiceQuestionProps {
  question: LearnQuestionData;
  index: number;
  total: number;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
  onSelectAnswer: (answer: string) => void;
  onCheckAnswer: () => void;
}

const TestChoiceQuestion = ({
  question,
  index,
  total,
  selectedAnswer,
  answerStatus,
  onSelectAnswer,
  onCheckAnswer,
}: TestChoiceQuestionProps) => {
  const getAnswerClass = (
    isSelected: boolean,
    isCorrect: boolean
  ) => {
    if (answerStatus === 'idle' && isSelected) {
      return 'trainingAnswerSelected';
    }

    if (answerStatus !== 'idle' && isCorrect) {
      return 'trainingAnswerCorrect';
    }

    if (answerStatus === 'wrong' && isSelected && !isCorrect) {
      return 'trainingAnswerWrong';
    }

    return '';
  };

  return (
    <div className="card w-full">
      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <p className="font-bold text-[var(--colorTextMuted)]">
          Выбор ответа
        </p>

        <p className="text-[var(--colorTextMuted)]">
          {index + 1} из {total}
        </p>
      </div>

      <h2 className="mb-[var(--gapXl)] text-[var(--fontSizeXl)] font-bold">
        | {question.question} |
      </h2>

      <p className="mb-[var(--gapMd)] font-bold">
        Выберите ответ
      </p>

      <div className="grid gap-[var(--gapMd)] md:grid-cols-2">
        {question.answers.map(answer => {
          const isSelected = selectedAnswer === answer;
          const isCorrect = answer === question.correctAnswer;

          return (
            <button
              key={answer}
              type="button"
              disabled={answerStatus !== 'idle'}
              onClick={() => onSelectAnswer(answer)}
              className={`
                trainingAnswer
                ${getAnswerClass(isSelected, isCorrect)}
              `}
            >
              | {answer} |
            </button>
          );
        })}
      </div>

      {answerStatus === 'idle' && (
        <div className="mt-[var(--gapXl)] flex justify-end">
          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={onCheckAnswer}
            className="button rounded-[var(--radiusPill)] bg-[var(--colorFocus)] disabled:opacity-40"
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  );
};

export default TestChoiceQuestion;