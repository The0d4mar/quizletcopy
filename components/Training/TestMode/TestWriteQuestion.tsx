'use client'

import { useState } from 'react';
import { AnswerStatus, WriteQuestionData } from '@/types/type';

interface TestWriteQuestionProps {
  question: WriteQuestionData;
  index: number;
  total: number;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
  onSubmitAnswer: (answer: string) => void;
}

const TestWriteQuestion = ({
  question,
  index,
  total,
  selectedAnswer,
  answerStatus,
  onSubmitAnswer,
}: TestWriteQuestionProps) => {
  const [value, setValue] = useState('');

  return (
    <div className="app-card w-full">
      <div className="mb-[var(--block-gap)] flex items-center justify-between">
        <p className="font-bold text-[var(--color-text-muted)]">
          Письменный вопрос
        </p>

        <p className="text-[var(--color-text-muted)]">
          {index + 1} из {total}
        </p>
      </div>

      <h2 className="mb-[var(--block-gap)] text-[var(--font-size-xl)] font-bold">
        | {question.question} |
      </h2>

      <p className="mb-[var(--item-gap)] font-bold">
        Ваш ответ
      </p>

      <input
        value={selectedAnswer ?? value}
        disabled={answerStatus !== 'idle'}
        onChange={e => setValue(e.target.value)}
        placeholder="Введите ответ"
        className={`
          mb-[var(--item-gap)]
          w-full
          rounded-[var(--radius-card)]
          border
          border-[var(--color-border)]
          bg-[var(--color-bg-soft)]
          px-[var(--padding-x-input)]
          py-[var(--padding-y-input)]
          font-bold
          outline-none
          transition
          focus:ring-2
          focus:ring-[var(--color-focus)]
          ${
            answerStatus === 'correct'
              ? 'border-[var(--color-success)] text-[var(--color-success)]'
              : ''
          }
          ${
            answerStatus === 'wrong'
              ? 'border-[var(--color-danger)] text-[var(--color-danger)]'
              : ''
          }
        `}
      />

      {answerStatus === 'wrong' && (
        <p className="mb-[var(--item-gap)] text-[var(--color-success)] font-bold">
          Правильный ответ: {question.correctAnswer}
        </p>
      )}

      {answerStatus === 'idle' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSubmitAnswer(value)}
            className="custom-btn rounded-[var(--radius-button)] bg-[var(--color-focus)]"
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  );
};

export default TestWriteQuestion;