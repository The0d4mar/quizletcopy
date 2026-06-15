'use client'

import { QuestionSide, TestQuestionType } from '@/types/type';

interface TestSetupModalProps {
  deckTitle: string;
  maxQuestions: number;
  questionsCount: number;
  questionTypes: TestQuestionType[];
  onQuestionsCountChange: (value: number) => void;
  onQuestionTypesChange: (value: TestQuestionType[]) => void;
  onSelectSide: (side: QuestionSide) => void;
  onStart: () => void;
  onClose: () => void;
}

const testTypes: { label: string; value: TestQuestionType }[] = [
  { label: 'Вопросы с выбором ответа', value: 'choice' },
  { label: 'Подбор', value: 'match' },
  { label: 'Письменные вопросы', value: 'write' },
];

const TestSetupModal = ({
  deckTitle,
  maxQuestions,
  questionsCount,
  questionTypes,
  onQuestionsCountChange,
  onQuestionTypesChange,
  onSelectSide,
  onStart,
  onClose,
}: TestSetupModalProps) => {
  const toggleType = (type: TestQuestionType) => {
    if (questionTypes.includes(type)) {
      const updatedTypes = questionTypes.filter(value => value !== type);

      if (updatedTypes.length === 0) return;

      onQuestionTypesChange(updatedTypes);
      return;
    }

    onQuestionTypesChange([...questionTypes, type]);
  };

  return (
    <div className="app-modal-overlay">
      <div className="app-modal">
        <div className="mb-[var(--block-gap)] flex items-start justify-between">
          <div>
            <p className="font-bold text-[var(--color-text-muted)]">
              {deckTitle}
            </p>

            <h2 className="text-[var(--font-size-xl)] font-bold">
              Настройте свой тест
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

        <div className="mb-[var(--block-gap)] flex items-center justify-between">
          <p className="font-bold">
            Вопросы максимум {maxQuestions}
          </p>

          <input
            type="number"
            min={1}
            max={maxQuestions}
            value={questionsCount}
            onChange={e => onQuestionsCountChange(Number(e.target.value))}
            className="w-[90px] rounded-[var(--radius-card)] bg-[var(--color-surface-light)] px-4 py-3 font-bold outline-none"
          />
        </div>

        <div className="mb-[var(--block-gap)]">
          <p className="mb-3 font-bold">Ответ</p>

          <div className="grid gap-[var(--item-gap)] md:grid-cols-2">
            <button
              type="button"
              onClick={() => onSelectSide('original')}
              className="app-card text-left font-bold"
            >
              Термин → определение
            </button>

            <button
              type="button"
              onClick={() => onSelectSide('translation')}
              className="app-card text-left font-bold"
            >
              Определение → термин
            </button>
          </div>
        </div>

        <div className="mb-[var(--block-gap)] flex flex-col gap-4">
          {testTypes.map(type => {
            const checked = questionTypes.includes(type.value);

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => toggleType(type.value)}
                className="flex items-center justify-between font-bold"
              >
                <span>{type.label}</span>

                <span
                  className={`
                    relative h-6 w-11 rounded-[var(--radius-button)] transition
                    ${checked ? 'bg-[var(--color-focus)]' : 'bg-[var(--color-surface-light)]'}
                  `}
                >
                  <span
                    className={`
                      absolute top-1 h-4 w-4 rounded-full bg-white transition
                      ${checked ? 'left-6' : 'left-1'}
                    `}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onStart}
            className="custom-btn rounded-[var(--radius-button)] bg-[var(--color-focus)]"
          >
            Начать тест
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSetupModal;