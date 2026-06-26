'use client'

import { useState } from 'react';
import { AnswerStatus, WriteQuestionData } from '@/types/types.type';

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
    <div className="card w-full">
      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <p className="font-bold text-[var(--colorTextMuted)]">
          Письменный вопрос
        </p>

        <p className="text-[var(--colorTextMuted)]">
          {index + 1} из {total}
        </p>
      </div>

      <h2 className="mb-[var(--gapXl)] text-[var(--fontSizeXl)] font-bold">
        | {question.question} |
      </h2>

      <p className="mb-[var(--gapMd)] font-bold">
        Ваш ответ
      </p>

      <input
        value={selectedAnswer ?? value}
        disabled={answerStatus !== 'idle'}
        onChange={e => setValue(e.target.value)}
        placeholder="Введите ответ"
        className={`
          mb-[var(--gapMd)]
          w-full
          rounded-[var(--radiusCard)]
          border
          border-[var(--colorBorder)]
          bg-[var(--colorBgSoft)]
          px-[var(--paddingInputX)]
          py-[var(--paddingInputY)]
          font-bold
          outline-none
          transition
          focus:ring-2
          focus:ring-[var(--colorFocus)]
          ${
            answerStatus === 'correct'
              ? 'border-[var(--colorSuccess)] text-[var(--colorSuccess)]'
              : ''
          }
          ${
            answerStatus === 'wrong'
              ? 'border-[var(--colorDanger)] text-[var(--colorDanger)]'
              : ''
          }
        `}
      />

      {answerStatus === 'wrong' && (
        <p className="mb-[var(--gapMd)] text-[var(--colorSuccess)] font-bold">
          Правильный ответ: {question.correctAnswer}
        </p>
      )}

      {answerStatus === 'idle' && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSubmitAnswer(value)}
            className="button rounded-[var(--radiusPill)] bg-[var(--colorFocus)]"
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  );
};

export default TestWriteQuestion;