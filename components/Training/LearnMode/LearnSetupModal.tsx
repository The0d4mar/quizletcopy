'use client'

import { QuestionSide } from "@/types/type";


interface LearnSetupModalProps {
  deckTitle: string;
  onSelectSide: (side: QuestionSide) => void;
  onClose: () => void;
}

const LearnSetupModal = ({
  deckTitle,
  onSelectSide,
  onClose,
}: LearnSetupModalProps) => {
  return (
    <div className="app-modal-overlay">
      <div className="app-modal">
        <div className="mb-[var(--block-gap)] flex items-start justify-between">
          <div>
            <p className="font-bold text-[var(--color-text-muted)]">
              {deckTitle}
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold">
              Настройте заучивание
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="custom-btn rounded-[var(--radius-button)]"
          >
            ×
          </button>
        </div>

        <div className="grid gap-[var(--item-gap)] md:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelectSide('original')}
            className="app-card text-left font-bold"
          >
            Показывать термин
          </button>

          <button
            type="button"
            onClick={() => onSelectSide('translation')}
            className="app-card text-left font-bold"
          >
            Показывать определение
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnSetupModal;