"use client";

import { EntityFilter, SortType } from "@/types/types.type";
import { ChevronDown } from "lucide-react";

interface LibraryControlsProps {
  entityFilter: EntityFilter;
  sortType: SortType;
  onEntityFilterChange: (value: EntityFilter) => void;
  onSortTypeChange: (value: SortType) => void;
}

const filterItems: { label: string; value: EntityFilter }[] = [
  { label: "\u0412\u0441\u0435", value: "all" },
  { label: "\u041c\u043e\u0434\u0443\u043b\u0438", value: "decks" },
  { label: "\u041f\u0430\u043f\u043a\u0438", value: "folders" },
];

const sortOptions: { label: string; value: SortType }[] = [
  { label: "\u041d\u0435\u0434\u0430\u0432\u043d\u043e \u0441\u043e\u0437\u0434\u0430\u043d\u043d\u044b\u0435", value: "created" },
  { label: "\u041d\u0435\u0434\u0430\u0432\u043d\u043e \u0438\u0437\u043c\u0435\u043d\u0451\u043d\u043d\u044b\u0435", value: "updated" },
  { label: "\u041d\u0435\u0434\u0430\u0432\u043d\u043e \u043f\u0440\u043e\u0441\u043c\u043e\u0442\u0440\u0435\u043d\u043d\u044b\u0435", value: "viewed" },
];

const LibraryControls = ({
  entityFilter,
  sortType,
  onEntityFilterChange,
  onSortTypeChange,
}: LibraryControlsProps) => {
  return (
    <div className="toolbar">
      <div className="actionRow">
        {filterItems.map((item) => (
          <button
            key={item.value}
            onClick={() => onEntityFilterChange(item.value)}
            className={`button buttonPill ${entityFilter === item.value ? "border-[var(--colorBorderStrong)]" : "buttonSurface border-transparent"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-fit">
        <select
          value={sortType}
          onChange={(event) => onSortTypeChange(event.target.value as SortType)}
          className="selectControl"
        >
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>

        <ChevronDown size={18} className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 text-[var(--colorTextMuted)]" />
      </div>
    </div>
  );
};

export default LibraryControls;