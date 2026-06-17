'use client'

import { X } from 'lucide-react';
import { Card, CardData, Deck, FlashcardFrontSide } from '@/types/type';

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
    <div className="app-modal-overlay">
      <div className="app-modal">
        <div className="mb-[var(--block-gap)] flex items-start justify-between">
          <h2 className="text-[var(--font-size-xl)] font-bold">
            Параметры
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="custom-btn rounded-[var(--radius-button)]"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-[var(--block-gap)]">
          <div>
            <p className="mb-3 font-bold">
              Лицевая сторона
            </p>

            <div className="grid gap-[var(--item-gap)] md:grid-cols-2">
              <button
                type="button"
                onClick={() => onChangeFrontSide('original')}
                className={`
                  training-answer
                  ${frontSide === 'original' ? 'training-answer-selected' : ''}
                `}
              >
                Оригинал
              </button>

              <button
                type="button"
                onClick={() => onChangeFrontSide('translation')}
                className={`
                  training-answer
                  ${frontSide === 'translation' ? 'training-answer-selected' : ''}
                `}
              >
                Определение
              </button>
            </div>
          </div>
          <div className="mt-[var(--block-gap)]">
            <button
              type="button"
              onClick={onCleanCardsData}
              className="
                w-full
                text-left
                font-bold
                custom-btn
                border
                border-[var(--color-danger)]
                transition
                hover:opacity-80
              "
            >
              Сбросить статистику
            </button>
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          <button
            type="button"
            onClick={onResetProgress}
            className="
              w-fit
              font-bold
              text-[var(--color-danger)]
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