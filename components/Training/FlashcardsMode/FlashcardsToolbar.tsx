"use client";

import { Settings, Shuffle } from "lucide-react";

interface FlashcardsToolbarProps {
  repeatTracking: boolean;
  shuffled: boolean;
  canTrackProgress?: boolean;
  onToggleRepeatTracking: () => void;
  onToggleShuffle: () => void;
  onOpenSettings: () => void;
}

const FlashcardsToolbar = ({
  repeatTracking,
  shuffled,
  canTrackProgress = true,
  onToggleRepeatTracking,
  onToggleShuffle,
  onOpenSettings,
}: FlashcardsToolbarProps) => {
  return (
    <div className="mb-[var(--gapMd)] flex items-center justify-between gap-4">
      {canTrackProgress ? (
        <label className="flex items-center gap-3 font-bold text-[var(--colorTextMuted)]">
          <span>{"\u041e\u0442\u0441\u043b\u0435\u0436\u0438\u0432\u0430\u0442\u044c \u043f\u0440\u043e\u0433\u0440\u0435\u0441\u0441"}</span>

          <button
            type="button"
            onClick={onToggleRepeatTracking}
            className={`
              relative h-6 w-11 rounded-[var(--radiusPill)] transition
              ${repeatTracking ? "bg-[var(--colorFocus)]" : "bg-[var(--colorSurfaceLight)]"}
            `}
          >
            <span
              className={`
                absolute top-1 h-4 w-4 rounded-full bg-white transition
                ${repeatTracking ? "left-6" : "left-1"}
              `}
            />
          </button>
        </label>
      ) : (
        <span className="font-bold text-[var(--colorTextMuted)]">
          {"\u0422\u043e\u043b\u044c\u043a\u043e \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440"}
        </span>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleShuffle}
          aria-pressed={shuffled}
          className={`button buttonPill ${shuffled ? "buttonPrimary" : "buttonSurface"}`}
        >
          <Shuffle size={18} />
        </button>

        <button type="button" onClick={onOpenSettings} className="button rounded-[var(--radiusPill)]">
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardsToolbar;