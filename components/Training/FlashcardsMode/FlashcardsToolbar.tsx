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
    <div className="mb-[var(--gapMd)] flex items-center justify-between gap-4">
      <label className="flex items-center gap-3 font-bold text-[var(--colorTextMuted)]">
        <span>Отслеживать прогресс</span>

        <button
          type="button"
          onClick={onToggleRepeatTracking}
          className={`
            relative h-6 w-11 rounded-[var(--radiusPill)] transition
            ${repeatTracking ? 'bg-[var(--colorFocus)]' : 'bg-[var(--colorSurfaceLight)]'}
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
          aria-pressed={shuffled}
          className={`button buttonPill ${shuffled ? 'buttonPrimary' : 'buttonSurface'}`}
        >
          <Shuffle size={18} />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="button rounded-[var(--radiusPill)]"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsToolbar;
