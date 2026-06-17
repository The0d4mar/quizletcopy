'use client'

import { Settings, Shuffle } from 'lucide-react';

interface FlashcardsToolbarProps {
  repeatTracking: boolean;
  shuffled: boolean;
  onToggleRepeatTracking: () => void;
  onToggleShuffle: () => void;
  onOpenSettings: () => void;
}

const FlashcardsToolbar = ({
  repeatTracking,
  shuffled,
  onToggleRepeatTracking,
  onToggleShuffle,
  onOpenSettings,
}: FlashcardsToolbarProps) => {
  return (
    <div className="mb-[var(--item-gap)] flex items-center justify-between gap-4">
      <label className="flex items-center gap-3 font-bold text-[var(--color-text-muted)]">
        <span>Отслеживать прогресс</span>

        <button
          type="button"
          onClick={onToggleRepeatTracking}
          className={`
            relative h-6 w-11 rounded-[var(--radius-button)] transition
            ${repeatTracking ? 'bg-[var(--color-focus)]' : 'bg-[var(--color-surface-light)]'}
          `}
        >
          <span
            className={`
              absolute top-1 h-4 w-4 rounded-full bg-white transition
              ${repeatTracking ? 'left-6' : 'left-1'}
            `}
          />
        </button>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleShuffle}
          className={`
            custom-btn rounded-[var(--radius-button)]
            ${shuffled ? 'border-[var(--color-focus)] bg-[var(--color-surface-light)]' : ''}
          `}
        >
          <Shuffle size={18} />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="custom-btn rounded-[var(--radius-button)]"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsToolbar;