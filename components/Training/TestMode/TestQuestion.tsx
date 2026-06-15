'use client'

import { LearnQuestionData, AnswerStatus } from "@/types/type";


interface TestQuestionProps {
  question: LearnQuestionData;
  index: number;
  total: number;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
  onSelectAnswer: (answer: string) => void;
}

const TestQuestion = ({
  question,
  index,
  total,
  selectedAnswer,
  answerStatus,
  onSelectAnswer,
}: TestQuestionProps) => {
  return (
    <div className="app-card w-full">
      <div className="mb-[var(--block-gap)] flex items-center justify-between">
        <p className="font-bold text-[var(--color-text-muted)]">
          Определения
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
                app-card text-left font-bold
                ${
                  answerStatus !== 'idle' && isCorrect
                    ? 'border-[var(--color-success)] text-[var(--color-success)]'
                    : ''
                }
                ${
                  answerStatus === 'wrong' && isSelected && !isCorrect
                    ? 'border-[var(--color-danger)] text-[var(--color-danger)]'
                    : ''
                }
              `}
            >
              {answer}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TestQuestion;