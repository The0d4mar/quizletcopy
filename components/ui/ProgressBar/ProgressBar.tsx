import React, { FC } from 'react';

interface ProgressBarProps {
  progressPercent: number;
  currentIndex: number;
  deckCardsLength: number;
}

const ProgressBar: FC<ProgressBarProps> = ({
  progressPercent,
  currentIndex,
  deckCardsLength,
}) => {
  return (
    <div className="mt-[var(--spacing-item)]">
      <div className="h-2 w-full overflow-hidden rounded-[var(--radius-button)] bg-[var(--color-surface-light)]">
        <div
          className="h-full rounded-[var(--radius-button)] bg-[var(--color-focus)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-[var(--color-text-muted)]">
        Просмотрено: {currentIndex + 1} из {deckCardsLength}
      </p>
    </div>
  );
};

export default ProgressBar;