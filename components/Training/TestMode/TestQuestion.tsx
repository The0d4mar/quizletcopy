'use client'

import { LearnQuestionData, AnswerStatus } from "@/types/types.type";


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
    <div className="card w-full">
      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <p className="font-bold text-[var(--colorTextMuted)]">
          Определения
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
                card text-left font-bold
                ${
                  answerStatus !== 'idle' && isCorrect
                    ? 'border-[var(--colorSuccess)] text-[var(--colorSuccess)]'
                    : ''
                }
                ${
                  answerStatus === 'wrong' && isSelected && !isCorrect
                    ? 'border-[var(--colorDanger)] text-[var(--colorDanger)]'
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