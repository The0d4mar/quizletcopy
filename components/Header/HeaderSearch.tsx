'use client'

import { RootState } from '@/store/store';
import { SearchResult } from '@/types/types.type';
import { Search, FolderIcon, IdCardLanyard, Languages } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';


const HeaderSearch = () => {
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
          input

        "
      />

      <Search className="absolute left-100 top-1/2 z-20 translate-x-1/2 -translate-y-1/2" />

      {searchValue.trim() && (
        <div
          className="
            inputSearh
          "
        >
          {results.length === 0 ? (
            <div className="px-[var(--paddingCardX)] py-[var(--paddingCardY)] text-white/60">
              Ничего не найдено
            </div>
          ) : (
            <div className="flex max-h-[360px] flex-col overflow-y-auto scrollArea">
              {results.map(result => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={clearSearch}
                  className="
                    flex
                    items-center
                    gap-3
                    px-[var(--paddingCardX)]
                    py-[var(--paddingCardY)]
                    transition
                    hover:bg-[var(--colorBgSoft)]
                  "
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radiusCard)] bg-[var(--colorBgSoft)]">
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