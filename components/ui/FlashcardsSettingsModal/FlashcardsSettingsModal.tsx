"use client";

import { X } from "lucide-react";
import { FlashcardFrontSide } from "@/types/types.type";

interface FlashcardsSettingsModalProps {
  frontSide: FlashcardFrontSide;
  canManageProgress?: boolean;
  onChangeFrontSide: (side: FlashcardFrontSide) => void;
  onResetProgress: () => void;
  onClose: () => void;
  onCleanCardsData: () => void;
}

const labels = {
  title: "\u041f\u0430\u0440\u0430\u043c\u0435\u0442\u0440\u044b",
  frontSide: "\u041b\u0438\u0446\u0435\u0432\u0430\u044f \u0441\u0442\u043e\u0440\u043e\u043d\u0430",
  original: "\u041e\u0440\u0438\u0433\u0438\u043d\u0430\u043b",
  translation: "\u041e\u043f\u0440\u0435\u0434\u0435\u043b\u0435\u043d\u0438\u0435",
  resetStats: "\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0443",
  restart: "\u041f\u0440\u043e\u0439\u0442\u0438 \u043a\u0430\u0440\u0442\u043e\u0447\u043a\u0438 \u0437\u0430\u043d\u043e\u0432\u043e",
};

const FlashcardsSettingsModal = ({
  frontSide,
  canManageProgress = true,
  onChangeFrontSide,
  onResetProgress,
  onClose,
  onCleanCardsData,
}: FlashcardsSettingsModalProps) => {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="mb-[var(--gapXl)] flex items-start justify-between">
          <h2 className="text-[var(--fontSizeXl)] font-bold">{labels.title}</h2>

          <button type="button" onClick={onClose} className="button buttonGhost iconButton modalCloseButton">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-[var(--gapXl)]">
          <div>
            <p className="mb-3 font-bold">{labels.frontSide}</p>

            <div className="grid gap-[var(--gapMd)] md:grid-cols-2">
              <button
                type="button"
                onClick={() => onChangeFrontSide("original")}
                className={`trainingAnswer ${frontSide === "original" ? "trainingAnswerSelected" : ""}`}
              >
                {labels.original}
              </button>

              <button
                type="button"
                onClick={() => onChangeFrontSide("translation")}
                className={`trainingAnswer ${frontSide === "translation" ? "trainingAnswerSelected" : ""}`}
              >
                {labels.translation}
              </button>
            </div>
          </div>

          {canManageProgress && (
            <div className="mt-[var(--gapXl)]">
              <button
                type="button"
                onClick={onCleanCardsData}
                className="w-full text-left font-bold button border border-[var(--colorDanger)] transition hover:opacity-80"
              >
                {labels.resetStats}
              </button>
            </div>
          )}

          <div className="h-px bg-[var(--colorBorder)]" />

          <button
            type="button"
            onClick={onResetProgress}
            className="w-fit font-bold text-[var(--colorDanger)] transition hover:text-red-300"
          >
            {labels.restart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsSettingsModal;