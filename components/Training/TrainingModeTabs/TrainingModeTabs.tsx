'use client'

import { TrainingMode } from "@/types/type";



interface TrainingModeTabsProps {
  currentMode: TrainingMode;
  onChangeMode: (mode: TrainingMode) => void;
}

const tabs: { label: string; value: TrainingMode }[] = [
  { label: 'Карточки', value: 'cards' },
  { label: 'Заучивание', value: 'learn' },
  { label: 'Тест', value: 'test' },
];

const TrainingModeTabs = ({
  currentMode,
  onChangeMode,
}: TrainingModeTabsProps) => {
  return (
    <div className="mb-[var(--block-gap)] flex flex-wrap gap-[var(--item-gap)]">
      {tabs.map(tab => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChangeMode(tab.value)}
          className={`
            custom-btn rounded-[var(--radius-button)]
            ${
              currentMode === tab.value
                ? 'border-[var(--color-focus)] bg-[var(--color-surface-light)]'
                : 'bg-[var(--color-hover)]'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TrainingModeTabs;