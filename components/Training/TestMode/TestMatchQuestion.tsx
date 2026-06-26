'use client'

import { X } from 'lucide-react';
import { useState } from 'react';
import { AnswerStatus, MatchQuestionData } from '@/types/types.type';

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
    <div className="card w-full">
      <div className="mb-[var(--gapXl)] flex items-center justify-between">
        <p className="font-bold text-[var(--colorTextMuted)]">
          Сопоставление
        </p>

        <p className="text-[var(--colorTextMuted)]">
          {index + 1} из {total}
        </p>
      </div>

      <p className="mb-[var(--gapMd)] font-bold">
        Нажмите определение,
        подходящее термину
      </p>

      <div className="mb-[var(--gapXl)] h-px bg-[var(--colorBorder)]" />

      <div className="grid gap-[var(--gapXl)] md:grid-cols-[1fr_0.75fr]">
        {/* ЛЕВАЯ ЧАСТЬ — СЛОТЫ */}
        <div className="flex flex-col gap-[var(--gapMd)]">
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
                    trainingMatchSlot
                    ${
                      isSelected
                        ? 'trainingMatchSlotSelected'
                        : ''
                    }
                    ${
                      matchedTranslation
                        ? 'trainingMatchSlotFilled'
                        : ''
                    }
                    ${
                      isCorrect
                        ? 'trainingMatchSlotCorrect'
                        : ''
                    }
                    ${
                      isWrong
                        ? 'trainingMatchSlotWrong'
                        : ''
                    }
                  `}
                >
                  {matchedTranslation ? (
                    <div className="trainingMatchFilledContent">
                      <span
                      role="button"
                      tabIndex={0}
                      onClick={e => {
                        e.stopPropagation();
                        removeMatch(card.id);
                      }}
                      className="trainingMatchRemoveBtn"
                    >
                      <X size={18} />
                    </span>
                    <span className="trainingMatchFilledText">
                      {matchedTranslation.translation}
                    </span>

                    
                  </div>
                  ) : isSelected ? (
                    <span className='trainingMatchFilledAnswer'>
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
                    text-[var(--fontSizeMd)]
                    font-bold
                    transition
                    ${
                      isSelected
                        ? 'text-[var(--colorFocus)]'
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
        <div className="flex flex-col gap-[var(--gapMd)]">
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
                  trainingMatchOption
                  ${
                    selectedTermId
                      ? 'hover:border-[var(--colorFocus)]'
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
        <div className="mt-[var(--gapXl)] flex justify-end">
          <button
            type="button"
            disabled={
              Object.keys(matches).length !==
              terms.length
            }
            onClick={checkMatches}
            className="
              button
              rounded-[var(--radiusPill)]
              bg-[var(--colorFocus)]
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
