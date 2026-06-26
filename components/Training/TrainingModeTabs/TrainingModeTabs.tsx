'use client'

import { TrainingMode } from "@/types/types.type";



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
    <div className="mb-[var(--gapXl)] flex flex-wrap gap-[var(--gapMd)]">
      {tabs.map(tab => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChangeMode(tab.value)}
          className={`
            button rounded-[var(--radiusPill)]
            ${
              currentMode === tab.value
                ? 'border-[var(--colorFocus)] bg-[var(--colorSurfaceLight)]'
                : 'bg-[var(--colorSurfaceMuted)]'
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
