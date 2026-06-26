'use client'

import { QuestionSide } from "@/types/types.type";


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
    <div className="modalOverlay">
      <div className="modal">
        <div className="mb-[var(--gapXl)] flex items-start justify-between">
          <div>
            <p className="font-bold text-[var(--colorTextMuted)]">
              {deckTitle}
            </p>

            <h2 className="text-[var(--fontSizeXl)] font-bold">
              Настройте заучивание
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="button rounded-[var(--radiusPill)]"
          >
            ×
          </button>
        </div>

        <div className="grid gap-[var(--gapMd)] md:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelectSide('original')}
            className="card text-left font-bold"
          >
            Показывать термин
          </button>

          <button
            type="button"
            onClick={() => onSelectSide('translation')}
            className="card text-left font-bold"
          >
            Показывать определение
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnSetupModal;