'use client'

import { EntityFilter, SortType } from '@/types/types.type';
import { ChevronDown } from 'lucide-react';

interface LibraryControlsProps {
  entityFilter: EntityFilter;
  sortType: SortType;
  onEntityFilterChange: (value: EntityFilter) => void;
  onSortTypeChange: (value: SortType) => void;
}

const filterItems: { label: string; value: EntityFilter }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Модули', value: 'decks' },
  { label: 'Папки', value: 'folders' },
];

const LibraryControls = ({
  entityFilter,
  sortType,
  onEntityFilterChange,
  onSortTypeChange,
}: LibraryControlsProps) => {
  return (
    <div className="mb-[var(--marginButtom)] flex flex-col gap-[var(--gapXl)]">
      <div className="flex flex-wrap items-center gap-[var(--gapMd)]">
        {filterItems.map(item => (
          <button
            key={item.value}
            onClick={() => onEntityFilterChange(item.value)}
            className={`
              button rounded-[var(--radiusPill)]
              ${
                entityFilter === item.value
                  ? 'border-[var(--colorBorderStrong)]'
                  : 'bg-[var(--colorSurfaceMuted)] border-transparent'
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="relative w-fit">
        <select
          value={sortType}
          onChange={e => onSortTypeChange(e.target.value as SortType)}
          className="
            appearance-none
            rounded-[var(--radiusPill)]
            border
            border-[var(--colorBorder)]
            bg-[var(--colorSurfaceMuted)]
            px-[22px]
            py-[14px]
            pr-[52px]
            text-[var(--fontSizeSm)]
            font-semibold
            text-[var(--colorText)]
            outline-none
            transition-all
            duration-200
            hover:border-[var(--colorBorderHover)]
            hover:bg-[var(--colorSurfaceLight)]
            focus:border-[var(--colorFocus)]
            focus:ring-4
            focus:ring-[color:rgba(59,130,246,0.15)]
            shadow-[var(--shadowCard)]
            cursor-pointer
          "
        >
          <option value="created">
            Недавно созданные
          </option>

          <option value="updated">
            Недавно измененные
          </option>

          <option value="viewed">
            Недавно просмотренные
          </option>
        </select>

        <ChevronDown
          size={18}
          className="
            pointer-events-none
            absolute
            right-[18px]
            top-1/2
            -translate-y-1/2
            text-[var(--colorTextMuted)]
            transition-transform
          "
        />
      </div>
    </div>
  );
};

export default LibraryControls;