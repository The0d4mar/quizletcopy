'use client'

import { RootState } from '@/store/store';
import { SearchResult } from '@/types/type';
import { Search, FolderIcon, IdCardLanyard, Languages } from 'lucide-react';
import Link from 'next/link';
import { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';


const HeaderSearch: FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const decks = useSelector((state: RootState) => state.deckStore.decks);
  const folders = useSelector((state: RootState) => state.folders.folders);
  const cards = useSelector((state: RootState) => state.cardStore.cards);

  const normalizedSearch = searchValue.trim().toLowerCase();

  const results = useMemo<SearchResult[]>(() => {
    if (!normalizedSearch) return [];

    const deckResults: SearchResult[] = decks
      .filter(deck =>
        deck.title.toLowerCase().includes(normalizedSearch)
      )
      .map(deck => ({
        type: 'deck',
        id: deck.id,
        title: deck.title,
        subtitle: 'Модуль',
        href: `/deck/${deck.id}`,
      }));

    const folderResults: SearchResult[] = folders
      .filter(folder =>
        folder.title.toLowerCase().includes(normalizedSearch)
      )
      .map(folder => ({
        type: 'folder',
        id: folder.id,
        title: folder.title,
        subtitle: 'Папка',
        href: `/folders/${folder.id}`,
      }));

    const cardResults: SearchResult[] = cards
      .filter(card =>
        card.original.toLowerCase().includes(normalizedSearch) ||
        card.translation.toLowerCase().includes(normalizedSearch)
      )
      .map(card => {
        const parentDeck = decks.find(deck => deck.id === card.deckId);

        return {
          type: 'card',
          id: card.id,
          title: card.original,
          subtitle: `${card.translation} · ${parentDeck?.title ?? 'Без колоды'}`,
          href: `/deck/${card.deckId}`,
        };
      });

    return [...deckResults, ...folderResults, ...cardResults].slice(0, 8);
  }, [normalizedSearch, decks, folders, cards]);

  const getIcon = (type: SearchResult['type']) => {
    if (type === 'deck') return <IdCardLanyard size={20} />;
    if (type === 'folder') return <FolderIcon size={20} />;

    return <Languages size={20} />;
  };

  const clearSearch = () => {
    setSearchValue('');
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="Поиск вопроса"
        className="
          relative
          z-10
          w-full
          rounded-[var(--radius-card)]
          border
          border-[var(--color-border)]
          bg-black
          py-2
          pl-10
          pr-6
          transition-all
          duration-300
          ease-in-out
          placeholder:text-white/40
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--color-focus)]
        "
      />

      <Search className="absolute left-0 top-1/2 z-20 translate-x-1/2 -translate-y-1/2" />

      {searchValue.trim() && (
        <div
          className="
            absolute
            left-0
            top-[calc(100%+12px)]
            z-50
            w-full
            overflow-hidden
            rounded-[var(--radius-card)]
            border
            border-[var(--color-border)]
            bg-black
            shadow-[0_20px_50px_rgba(0,0,0,0.45)]
          "
        >
          {results.length === 0 ? (
            <div className="px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-white/60">
              Ничего не найдено
            </div>
          ) : (
            <div className="flex max-h-[360px] flex-col overflow-y-auto custom-scrollbar">
              {results.map(result => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={clearSearch}
                  className="
                    flex
                    items-center
                    gap-3
                    px-[var(--padding-x-card)]
                    py-[var(--padding-y-card)]
                    transition
                    hover:bg-[var(--color-hover)]
                  "
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-hover)]">
                    {getIcon(result.type)}
                  </span>

                  <span className="min-w-0">
                    <span className="block max-w-[280px] truncate font-bold">
                      {result.title}
                    </span>

                    <span className="block max-w-[280px] truncate text-sm text-white/60">
                      {result.subtitle}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;