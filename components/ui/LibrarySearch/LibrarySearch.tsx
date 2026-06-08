'use client'

import { Search } from 'lucide-react';

interface LibrarySearchProps {
  value: string;
  onChange: (value: string) => void;
}

const LibrarySearch = ({ value, onChange }: LibrarySearchProps) => {
  return (
    <div className="relative w-full max-w-xl">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Найти карточки"
        className="
          w-full
          rounded-[var(--radius-card)]
          border
          border-[var(--color-border)]
          bg-[var(--color-hover)]
          px-[var(--padding-x-input)]
          py-[var(--padding-y-input)]
          pr-12
          font-semibold
          outline-none
          placeholder:text-[var(--color-text-disabled)]
          transition
          hover:border-[var(--color-border-hover)]
          focus:ring-2
          focus:ring-[var(--color-focus)]
        "
      />

      <Search
        size={22}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
    </div>
  );
};

export default LibrarySearch;