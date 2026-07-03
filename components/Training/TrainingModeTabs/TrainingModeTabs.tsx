"use client";

import { TrainingMode } from "@/types/types.type";

interface TrainingModeTabsProps {
  currentMode: TrainingMode;
  onChangeMode: (mode: TrainingMode) => void;
  availableModes?: TrainingMode[];
  className?: string;
}

const tabs: { label: string; value: TrainingMode }[] = [
  { label: "\u041a\u0430\u0440\u0442\u043e\u0447\u043a\u0438", value: "cards" },
  { label: "\u0417\u0430\u0443\u0447\u0438\u0432\u0430\u043d\u0438\u0435", value: "learn" },
  { label: "\u0422\u0435\u0441\u0442", value: "test" },
];

const TrainingModeTabs = ({
  currentMode,
  onChangeMode,
  availableModes = ["cards", "learn", "test"],
  className = "",
}: TrainingModeTabsProps) => {
  const visibleTabs = tabs.filter((tab) => availableModes.includes(tab.value));

  return (
    <div className={`trainingModeTabs ${className}`}>
      {visibleTabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChangeMode(tab.value)}
          className={`button buttonPill ${currentMode === tab.value ? "border-[var(--colorFocus)] bg-[var(--colorSurfaceLight)]" : "buttonSurface"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TrainingModeTabs;