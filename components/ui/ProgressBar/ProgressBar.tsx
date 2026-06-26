import React from 'react';

interface ProgressBarProps {
  progressPercent: number;
  currentIndex: number;
  deckCardsLength: number;
}

const ProgressBar = ({
  progressPercent,
  currentIndex,
  deckCardsLength,
}: ProgressBarProps) => {
  return (
    <div className="mt-[var(--gapMd)]">
      <div className="h-2 w-full overflow-hidden rounded-[var(--radiusPill)] bg-[var(--colorSurfaceLight)]">
        <div
          className="h-full rounded-[var(--radiusPill)] bg-[var(--colorFocus)] transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-[var(--colorTextMuted)]">
        Просмотрено: {currentIndex + 1} из {deckCardsLength}
      </p>
    </div>
  );
};

export default ProgressBar;