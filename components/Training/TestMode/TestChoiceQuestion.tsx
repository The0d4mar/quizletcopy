'use client'

import { AnswerStatus, LearnQuestionData } from '@/types/type';

interface TestChoiceQuestionProps {
  question: LearnQuestionData;
  index: number;
  total: number;
  selectedAnswer: string | null;
  answerStatus: AnswerStatus;
  onSelectAnswer: (answer: string) => void;
}

const TestChoiceQuestion = ({
  question,
  index,
  total,
  selectedAnswer,
  answerStatus,
  onSelectAnswer,
}: TestChoiceQuestionProps) => {
  return (
    <div className="app-card w-full">
      <div className="mb-[var(--block-gap)] flex items-center justify-between">
        <p className="font-bold text-[var(--color-text-muted)]">
          Выбор ответа
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
                app-card min-h-[72px] text-left text-[var(--font-size-md)] font-bold
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
              | {answer} |
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TestChoiceQuestion;