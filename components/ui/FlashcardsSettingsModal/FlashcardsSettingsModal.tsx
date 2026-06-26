'use client'

import { X } from 'lucide-react';
import { Card, CardData, Deck, FlashcardFrontSide } from '@/types/types.type';

interface FlashcardsSettingsModalProps {
  frontSide: FlashcardFrontSide;
  onChangeFrontSide: (side: FlashcardFrontSide) => void;
  onResetProgress: () => void;
  onClose: () => void;
  onCleanCardsData: ()=>void;
}

const FlashcardsSettingsModal = ({
  frontSide,
  onChangeFrontSide,
  onResetProgress,
  onClose,
  onCleanCardsData
  
}: FlashcardsSettingsModalProps) => {
  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="mb-[var(--gapXl)] flex items-start justify-between">
          <h2 className="text-[var(--fontSizeXl)] font-bold">
            Параметры
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="button rounded-[var(--radiusPill)]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-[var(--gapXl)]">
          <div>
            <p className="mb-3 font-bold">
              Лицевая сторона
            </p>

            <div className="grid gap-[var(--gapMd)] md:grid-cols-2">
              <button
                type="button"
                onClick={() => onChangeFrontSide('original')}
                className={`
                  trainingAnswer
                  ${frontSide === 'original' ? 'trainingAnswerSelected' : ''}
                `}
              >
                Оригинал
              </button>

              <button
                type="button"
                onClick={() => onChangeFrontSide('translation')}
                className={`
                  trainingAnswer
                  ${frontSide === 'translation' ? 'trainingAnswerSelected' : ''}
                `}
              >
                Определение
              </button>
            </div>
          </div>
          <div className="mt-[var(--gapXl)]">
            <button
              type="button"
              onClick={onCleanCardsData}
              className="
                w-full
                text-left
                font-bold
                button
                border
                border-[var(--colorDanger)]
                transition
                hover:opacity-80
              "
            >
              Сбросить статистику
            </button>
          </div>

          <div className="h-px bg-[var(--colorBorder)]" />

          <button
            type="button"
            onClick={onResetProgress}
            className="
              w-fit
              font-bold
              text-[var(--colorDanger)]
              transition
              hover:text-red-300
            "
          >
            Пройти карточки заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardsSettingsModal;