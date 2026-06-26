'use client'

import { LearnQuestionData, AnswerStatus } from '@/types/types.type';

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
    <div className="card w-full max-w-[960px]">
      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <p className="font-bold text-[var(--colorTextMuted)]">
          Вопрос
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
              {answer}
            </button>
          );
        })}
      </div>

      <div className="mt-[var(--gapXl)] flex justify-end">
        {answerStatus === 'idle' ? (
          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={onCheckAnswer}
            className="
              button
              rounded-[var(--radiusPill)]
              bg-[var(--colorFocus)]
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
              button
              rounded-[var(--radiusPill)]
              bg-[var(--colorFocus)]
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