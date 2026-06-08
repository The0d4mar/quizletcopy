'use client'

import { EntityFilter, SortType } from '@/types/type';
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
    <div className="mb-[var(--margin-b-elems)] flex flex-col gap-[var(--block-gap)]">
      <div className="flex flex-wrap items-center gap-[var(--item-gap)]">
        {filterItems.map(item => (
          <button
            key={item.value}
            onClick={() => onEntityFilterChange(item.value)}
            className={`
              custom-btn rounded-[var(--radius-button)]
              ${
                entityFilter === item.value
                  ? 'border-[var(--color-border-strong)]'
                  : 'bg-[var(--color-hover)] border-transparent'
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
            rounded-[var(--radius-button)]
            border
            border-[var(--color-border)]
            bg-[var(--color-hover)]
            px-[22px]
            py-[14px]
            pr-[52px]
            text-[var(--font-size-sm)]
            font-semibold
            text-[var(--color-text)]
            outline-none
            transition-all
            duration-200
            hover:border-[var(--color-border-hover)]
            hover:bg-[var(--color-surface-light)]
            focus:border-[var(--color-focus)]
            focus:ring-4
            focus:ring-[color:rgba(59,130,246,0.15)]
            shadow-[var(--shadow-card)]
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
            text-[var(--color-text-muted)]
            transition-transform
          "
        />
      </div>
    </div>
  );
};

export default LibraryControls;