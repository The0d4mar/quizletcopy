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
          rounded-[var(--radiusCard)]
          border
          border-[var(--colorBorder)]
          bg-[var(--colorSurfaceMuted)]
          px-[var(--paddingInputX)]
          py-[var(--paddingInputY)]
          pr-12
          font-semibold
          outline-none
          placeholder:text-[var(--colorTextDisabled)]
          transition
          hover:border-[var(--colorBorderHover)]
          focus:ring-2
          focus:ring-[var(--colorFocus)]
        "
      />

      <Search
        size={22}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--colorTextMuted)]"
      />
    </div>
  );
};

export default LibrarySearch;