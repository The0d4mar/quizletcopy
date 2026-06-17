'use client'

import { LearnQuestionData, AnswerStatus } from '@/types/type';

interface LearnQuestionProps {
  question: LearnQuestionData;
  index: number;
  total: number;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
  onSelectAnswer: (answer: string) => void;
  onCheckAnswer: () => void;
  onNext: () => void;
}

const LearnQuestion = ({
  question,
  index,
  total,
  selectedAnswer,
  answerStatus,
  onSelectAnswer,
  onCheckAnswer,
  onNext,
}: LearnQuestionProps) => {
  const getAnswerClass = (
    isSelected: boolean,
    isCorrect: boolean
  ) => {
    if (answerStatus === 'idle' && isSelected) {
      return 'training-answer-selected';
    }

    if (answerStatus !== 'idle' && isCorrect) {
      return 'training-answer-correct';
    }

    if (answerStatus === 'wrong' && isSelected && !isCorrect) {
      return 'training-answer-wrong';
    }

    return '';
  };

  return (
    <div className="app-card w-full max-w-[960px]">
      <div className="mb-[var(--block-gap)] flex items-center justify-between">
        <p className="font-bold text-[var(--color-text-muted)]">
          Вопрос
        </p>

        <p className="text-[var(--color-text-muted)]">
          {index + 1} из {total}
        </p>
      </div>

      <h2 className="mb-[var(--block-gap)] text-[var(--font-size-xl)] font-bold">
        | {question.question} |
      </h2>

      <p className="mb-[var(--item-gap)] font-bold">
        Выберите ответ
      </p>

      <div className="grid gap-[var(--item-gap)] md:grid-cols-2">
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
                training-answer
                ${getAnswerClass(isSelected, isCorrect)}
              `}
            >
              {answer}
            </button>
          );
        })}
      </div>

      <div className="mt-[var(--block-gap)] flex justify-end">
        {answerStatus === 'idle' ? (
          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={onCheckAnswer}
            className="
              custom-btn
              rounded-[var(--radius-button)]
              bg-[var(--color-focus)]
              disabled:opacity-40
            "
          >
            Проверить
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="
              custom-btn
              rounded-[var(--radius-button)]
              bg-[var(--color-focus)]
            "
          >
            Далее
          </button>
        )}
      </div>
    </div>
  );
};

export default LearnQuestion;