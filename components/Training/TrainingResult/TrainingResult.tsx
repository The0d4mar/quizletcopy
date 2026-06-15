'use client'

import { Card } from '@/types/type';
import { Check, X } from 'lucide-react';

export type TrainingMistake = {
  card: Card;
  selectedAnswer: string;
  correctAnswer: string;
};

interface TrainingResultProps {
  deckTitle: string;
  correctCount: number;
  wrongCount: number;
  mistakes: TrainingMistake[];
  onRestart: () => void;
  onExit: () => void;
}

const TrainingResult = ({
  deckTitle,
  correctCount,
  wrongCount,
  mistakes,
  onRestart,
  onExit,
}: TrainingResultProps) => {
  const total = correctCount + wrongCount;
  const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <section className="mx-auto flex w-full max-w-[960px] flex-col gap-[var(--block-gap)]">
      <div className="text-center">
        <p className="mb-2 text-[var(--color-text-muted)] font-bold">
          {deckTitle}
        </p>

        <h2 className="text-[var(--font-size-xl)] font-bold">
          {percent >= 70
            ? 'Отлично, продолжайте в том же духе!'
            : 'Не волнуйтесь, в другой раз все получится!'}
        </h2>
      </div>

      <div className="app-card">
        <div className="grid gap-[var(--block-gap)] md:grid-cols-[160px_1fr] md:items-center">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-[10px] border-[var(--color-warning)] text-[var(--font-size-xl)] font-bold">
            {percent}%
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-[var(--color-success)] font-bold">
              <Check size={20} />
              <span>Правильно</span>
              <span className="rounded-[var(--radius-button)] border border-[var(--color-success)] px-4 py-1">
                {correctCount}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[var(--color-warning)] font-bold">
              <X size={20} />
              <span>Неправильно</span>
              <span className="rounded-[var(--radius-button)] border border-[var(--color-warning)] px-4 py-1">
                {wrongCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {mistakes.length > 0 && (
        <div>
          <h3 className="mb-4 text-[var(--font-size-lg)] font-bold">
            Ошибки
          </h3>

          <div className="flex flex-col gap-[var(--item-gap)]">
            {mistakes.map(mistake => (
              <div
                key={mistake.card.id}
                className="app-card grid gap-4 md:grid-cols-2"
              >
                <div>
                  <p className="mb-2 text-[var(--color-text-muted)] font-bold">
                    Термин
                  </p>
                  <p className="text-[var(--font-size-md)]">
                    | {mistake.card.original} |
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[var(--color-text-muted)] font-bold">
                    Правильный ответ
                  </p>
                  <p className="text-[var(--color-success)] font-bold">
                    | {mistake.correctAnswer} |
                  </p>

                  <p className="mt-3 text-[var(--color-danger)]">
                    Ваш ответ: {mistake.selectedAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-[var(--item-gap)]">
        <button
          type="button"
          onClick={onRestart}
          className="custom-btn rounded-[var(--radius-button)]"
        >
          Повторить
        </button>

        <button
          type="button"
          onClick={onExit}
          className="custom-btn rounded-[var(--radius-button)] bg-[var(--color-focus)]"
        >
          Вернуться к карточкам
        </button>
      </div>
    </section>
  );
};

export default TrainingResult;