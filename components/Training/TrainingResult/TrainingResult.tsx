'use client'

import { TrainingMistake } from '@/types/types.type';

interface TrainingResultProps {
  deckTitle: string;
  correctCount: number;
  wrongCount: number;
  mistakes: TrainingMistake[];
  pageFlag?: boolean;
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
  pageFlag = false,
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
        var(--colorSuccess) 0% ${correctPercent}%,
        var(--colorWarning) ${correctPercent}% ${correctPercent + wrongPercent}%,
        rgba(255,255,255,0.08) ${correctPercent + wrongPercent}% 100%
      )
    `,
  };

  return (
    <section className="trainingResult">
      <div className="trainingResultHeader">
        <p className="trainingResultDeckTitle">
          {deckTitle}
        </p>

        <h2 className="trainingResultTitle">
          {successRate >= 80
            ? 'Отлично, продолжайте в том же духе!'
            : successRate >= 50
              ? 'Хороший результат, но есть что повторить'
              : 'Не волнуйтесь, в другой раз всё получится!'}
        </h2>
      </div>

      <div className="trainingResultCard appCard">
        <div className="trainingResultChart" style={chartStyle}>
          <div className="trainingResultChartInner">
            {successRate}%
          </div>
        </div>

        <div className="trainingResultStats">
          <div className="trainingResultRow trainingResultSuccess">
            <span>✓ Правильно</span>
            <div className="trainingResultCount">{correctCount}</div>
          </div>

          <div className="trainingResultRow trainingResultWrong">
            <span>✕ Неправильно</span>
            <div className="trainingResultCount">{wrongCount}</div>
          </div>
        </div>
      </div>

      {mistakes.length > 0 && (
        <div className="training-result-mistakes">
          <h3 className="mb-4 text-[var(--fontSizeLg)] font-bold">
            Ошибки
          </h3>

          <div className="flex flex-col gap-[var(--gapMd)]">
            {mistakes.map(mistake => (
              <div
                key={mistake.card.id}
                className="card grid gap-4 md:grid-cols-2"
              >
                <div>
                  <p className="mb-2 text-[var(--colorTextMuted)] font-bold">
                    Термин
                  </p>

                  <p className="font-bold">
                    | {mistake.card.original} |
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-[var(--colorTextMuted)] font-bold">
                    Правильный ответ
                  </p>

                  <p className="font-bold text-[var(--colorSuccess)]">
                    | {mistake.correctAnswer} |
                  </p>

                  <p className="mt-2 text-[var(--colorDanger)]">
                    Ваш ответ: {mistake.selectedAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="trainingResultActions">
        <button
          type="button"
          onClick={onRestart}
          className="button"
        >
          Повторить
        </button>
      {!pageFlag ? 
          <button
            type="button"
            onClick={onExit}
            className="button trainingResultBackBtn"
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