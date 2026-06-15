'use client'

import { useState } from 'react';
import { AnswerStatus, MatchQuestionData } from '@/types/type';
import { shuffleArray } from '../trainingUtils';

interface TestMatchQuestionProps {
  question: MatchQuestionData;
  index: number;
  total: number;
  answerStatus: AnswerStatus;
  onFinishMatch: (isCorrect: boolean, wrongCardIds: string[]) => void;
}

const TestMatchQuestion = ({
  question,
  index,
  total,
  answerStatus,
  onFinishMatch,
}: TestMatchQuestionProps) => {
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  const terms = question.cards;
  const translations = shuffleArray(question.cards);

  const handleTranslationClick = (translationCardId: string) => {
    if (!selectedTermId || answerStatus !== 'idle') return;

    setMatches(prev => ({
      ...prev,
      [selectedTermId]: translationCardId,
    }));

    setSelectedTermId(null);
  };

  const checkMatches = () => {
    const wrongCardIds = terms
      .filter(card => matches[card.id] !== card.id)
      .map(card => card.id);

    onFinishMatch(wrongCardIds.length === 0, wrongCardIds);
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

      <p className="mb-[var(--block-gap)] font-bold">
        Нажмите термин, затем подходящее определение
      </p>

      <div className="grid gap-[var(--block-gap)] md:grid-cols-2">
        <div className="flex flex-col gap-[var(--item-gap)]">
          {terms.map(card => {
            const selected = selectedTermId === card.id;
            const matched = Boolean(matches[card.id]);

            return (
              <button
                key={card.id}
                type="button"
                disabled={answerStatus !== 'idle'}
                onClick={() => setSelectedTermId(card.id)}
                className={`
                  app-card min-h-[64px] text-left font-bold
                  ${selected ? 'border-[var(--color-focus)] text-[var(--color-focus)]' : ''}
                  ${matched ? 'opacity-60' : ''}
                `}
              >
                | {card.original} |
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-[var(--item-gap)]">
          {translations.map(card => {
            const used = Object.values(matches).includes(card.id);

            return (
              <button
                key={card.id}
                type="button"
                disabled={used || answerStatus !== 'idle'}
                onClick={() => handleTranslationClick(card.id)}
                className="app-card min-h-[64px] text-left font-bold disabled:opacity-40"
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
            disabled={Object.keys(matches).length !== terms.length}
            onClick={checkMatches}
            className="custom-btn rounded-[var(--radius-button)] bg-[var(--color-focus)] disabled:opacity-40"
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  );
};

export default TestMatchQuestion;