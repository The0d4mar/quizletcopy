'use client'

import { X } from 'lucide-react';
import { useState } from 'react';
import { AnswerStatus, MatchQuestionData } from '@/types/type';

interface TestMatchQuestionProps {
  question: MatchQuestionData;
  index: number;
  total: number;
  answerStatus: AnswerStatus;
  onFinishMatch: (
    isCorrect: boolean,
    wrongCardIds: string[]
  ) => void;
}

const TestMatchQuestion = ({
  question,
  index,
  total,
  answerStatus,
  onFinishMatch,
}: TestMatchQuestionProps) => {
  const terms = question.cards ?? [];
  const translations =
    question.shuffledCards ?? question.cards ?? [];

  const [selectedTermId, setSelectedTermId] =
    useState<string | null>(null);

  const [matches, setMatches] = useState<
    Record<string, string>
  >({});

  const handleTermClick = (termId: string) => {
    if (answerStatus !== 'idle') return;

    setSelectedTermId(termId);
  };

  const handleTranslationClick = (
    translationCardId: string
  ) => {
    if (!selectedTermId) return;
    if (answerStatus !== 'idle') return;

    setMatches(prev => ({
      ...prev,
      [selectedTermId]: translationCardId,
    }));

    setSelectedTermId(null);
  };

  const removeMatch = (termId: string) => {
    if (answerStatus !== 'idle') return;

    setMatches(prev => {
      const updated = { ...prev };
      delete updated[termId];
      return updated;
    });
  };

  const checkMatches = () => {
    const wrongCardIds = terms
      .filter(card => matches[card.id] !== card.id)
      .map(card => card.id);

    onFinishMatch(
      wrongCardIds.length === 0,
      wrongCardIds
    );
  };

  return (
    <div className="app-card w-full">
      <div className="mb-[var(--block-gap)] flex items-center justify-between">
        <p className="font-bold text-[var(--color-text-muted)]">
          Сопоставление
        </p>

        <p className="text-[var(--color-text-muted)]">
          {index + 1} из {total}
        </p>
      </div>

      <p className="mb-[var(--item-gap)] font-bold">
        Нажмите определение,
        подходящее термину
      </p>

      <div className="mb-[var(--block-gap)] h-px bg-[var(--color-border)]" />

      <div className="grid gap-[var(--block-gap)] md:grid-cols-[1fr_0.75fr]">
        {/* ЛЕВАЯ ЧАСТЬ — СЛОТЫ */}
        <div className="flex flex-col gap-[var(--item-gap)]">
          {terms.map(card => {
            const matchedTranslationId =
              matches[card.id];

            const matchedTranslation =
              translations.find(
                translation =>
                  translation.id ===
                  matchedTranslationId
              );

            const isSelected =
              selectedTermId === card.id;

            const isCorrect =
              answerStatus !== 'idle' &&
              matchedTranslationId === card.id;

            const isWrong =
              answerStatus !== 'idle' &&
              matchedTranslationId &&
              matchedTranslationId !== card.id;

            return (
              <div
                key={card.id}
                className="
                  grid
                  items-center
                  gap-4
                  md:grid-cols-[1fr_auto]
                "
              >
                <button
                  type="button"
                  disabled={
                    answerStatus !== 'idle'
                  }
                  onClick={() =>
                    handleTermClick(card.id)
                  }
                  className={`
                    training-match-slot
                    ${
                      isSelected
                        ? 'training-match-slot-selected'
                        : ''
                    }
                    ${
                      matchedTranslation
                        ? 'training-match-slot-filled'
                        : ''
                    }
                    ${
                      isCorrect
                        ? 'training-match-slot-correct'
                        : ''
                    }
                    ${
                      isWrong
                        ? 'training-match-slot-wrong'
                        : ''
                    }
                  `}
                >
                  {matchedTranslation ? (
                    <div className="training-match-filled-content">
                      <span
                      role="button"
                      tabIndex={0}
                      onClick={e => {
                        e.stopPropagation();
                        removeMatch(card.id);
                      }}
                      className="training-match-remove-btn"
                    >
                      <X size={18} />
                    </span>
                    <span className="training-match-filled-text">
                      {matchedTranslation.translation}
                    </span>

                    
                  </div>
                  ) : isSelected ? (
                    <span className='training-math-filled-answer'>
                      Выберите из списка ниже
                    </span>
                  ) : (
                    <span />
                  )}
                </button>

                <p
                  onClick={() =>
                    handleTermClick(card.id)
                  }
                  className={`
                    cursor-pointer
                    text-[var(--font-size-md)]
                    font-bold
                    transition
                    ${
                      isSelected
                        ? 'text-[var(--color-focus)]'
                        : ''
                    }
                  `}
                >
                  | {card.original} |
                </p>
              </div>
            );
          })}
        </div>

        {/* ПРАВАЯ ЧАСТЬ — ВАРИАНТЫ */}
        <div className="flex flex-col gap-[var(--item-gap)]">
          {translations.map(card => {
            const isUsed =
              Object.values(matches).includes(
                card.id
              );

            return (
              <button
                key={card.id}
                type="button"
                disabled={
                  answerStatus !== 'idle' ||
                  !selectedTermId ||
                  isUsed
                }
                onClick={() =>
                  handleTranslationClick(
                    card.id
                  )
                }
                className={`
                  training-match-option
                  ${
                    selectedTermId
                      ? 'hover:border-[var(--color-focus)]'
                      : ''
                  }
                  disabled:opacity-40
                `}
              >
                | {card.translation} |
              </button>
            );
          })}
        </div>
      </div>

      {answerStatus === 'idle' && (
        <div className="mt-[var(--block-gap)] flex justify-end">
          <button
            type="button"
            disabled={
              Object.keys(matches).length !==
              terms.length
            }
            onClick={checkMatches}
            className="
              custom-btn
              rounded-[var(--radius-button)]
              bg-[var(--color-focus)]
              disabled:opacity-40
            "
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  );
};

export default TestMatchQuestion;