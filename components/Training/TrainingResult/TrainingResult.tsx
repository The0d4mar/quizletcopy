'use client'

import { Card } from '@/types/type';

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
  pageFlag: boolean;
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
  pageFlag,
}: TrainingResultProps) => {
  const totalAnswers = correctCount + wrongCount;

  const correctPercent =
    totalAnswers > 0 ? (correctCount / totalAnswers) * 100 : 0;

  const wrongPercent =
    totalAnswers > 0 ? (wrongCount / totalAnswers) * 100 : 0;

  const successRate = Math.round(correctPercent);

  const chartStyle = {
    background: `
      conic-gradient(
        var(--color-success) 0% ${correctPercent}%,
        var(--color-warning) ${correctPercent}% ${correctPercent + wrongPercent}%,
        rgba(255,255,255,0.08) ${correctPercent + wrongPercent}% 100%
      )
    `,
  };

  return (
    <section className="training-result">
      <div className="training-result-header">
        <p className="training-result-deck-title">
          {deckTitle}
        </p>

        <h2 className="training-result-title">
          {successRate >= 80
            ? 'Отлично, продолжайте в том же духе!'
            : successRate >= 50
              ? 'Хороший результат, но есть что повторить'
              : 'Не волнуйтесь, в другой раз всё получится!'}
        </h2>
      </div>

      <div className="training-result-card app-card">
        <div className="training-result-chart" style={chartStyle}>
          <div className="training-result-chart-inner">
            {successRate}%
          </div>
        </div>

        <div className="training-result-stats">
          <div className="training-result-row training-result-success">
            <span>✓ Правильно</span>
            <div className="training-result-count">{correctCount}</div>
          </div>

          <div className="training-result-row training-result-wrong">
            <span>✕ Неправильно</span>
            <div className="training-result-count">{wrongCount}</div>
          </div>
        </div>
      </div>

      {mistakes.length > 0 && (
        <div className="training-result-mistakes">
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

                  <p className="font-bold">
                    | {mistake.card.original} |
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[var(--color-text-muted)] font-bold">
                    Правильный ответ
                  </p>

                  <p className="font-bold text-[var(--color-success)]">
                    | {mistake.correctAnswer} |
                  </p>

                  <p className="mt-2 text-[var(--color-danger)]">
                    Ваш ответ: {mistake.selectedAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="training-result-actions">
        <button
          type="button"
          onClick={onRestart}
          className="custom-btn"
        >
          Повторить
        </button>
      {!pageFlag ? 
          <button
            type="button"
            onClick={onExit}
            className="custom-btn training-result-back-btn"
          >
            Вернуться к карточкам
          </button>
          : undefined
        }
      </div>
    </section>
  );
};

export default TrainingResult;