'use client'

import LibraryControls from '@/components/ui/LibraryControls/LibraryControls';
import LibraryGroup from '@/components/ui/LibraryGroup/LibraryGroup';
import LibrarySearch from '@/components/ui/LibrarySearch/LibrarySearch';
import { createLibraryItems, filterLibraryItems, groupLibraryItems,  } from '@/api/localFunc';
import { loadCards, loadDecks, loadFolders } from '@/storage';
import { Card, Deck, EntityFilter, Folder, SortType } from '@/types/type';
import { useMemo, useState } from 'react';

const SetsPage = () => {
  const [decks] = useState<Deck[]>(() => loadDecks());
  const [cards] = useState<Card[]>(() => loadCards());
  const [folders] = useState<Folder[]>(() => loadFolders());

  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [sortType, setSortType] = useState<SortType>('updated');
  const [searchValue, setSearchValue] = useState('');

  const libraryItems = useMemo(
    () => createLibraryItems(decks, cards, folders),
    [decks, cards, folders]
  );

  const filteredItems = useMemo(
    () =>
      filterLibraryItems(
        libraryItems,
        entityFilter,
        searchValue,
        sortType
      ),
    [libraryItems, entityFilter, searchValue, sortType]
  );

  const groupedItems = useMemo(
    () => groupLibraryItems(filteredItems, sortType),
    [filteredItems, sortType]
  );

  return (
    <section className="custom-main-section">
      <div className="mb-[var(--margin-b-elems)]">
        <h1 className="mb-[var(--margin-b-elems)] text-[var(--font-size-page-title)] font-bold leading-[var(--line-height-tight)]">
          Ваша библиотека
        </h1>

        <div className="mb-[var(--margin-b-elems)] flex flex-col gap-[var(--block-gap)] lg:flex-row lg:items-end lg:justify-between">
          <LibraryControls
            entityFilter={entityFilter}
            sortType={sortType}
            onEntityFilterChange={setEntityFilter}
            onSortTypeChange={setSortType}
          />

          <LibrarySearch
            value={searchValue}
            onChange={setSearchValue}
          />
        </div>

        {filteredItems.length === 0 ? (
          <div className="px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-[var(--color-text-muted)]">
            Ничего не найдено
          </div>
        ) : (
          <div className="flex flex-col gap-[var(--section-gap)]">
            {Object.entries(groupedItems).map(([groupTitle, items]) => (
              <LibraryGroup
                key={groupTitle}
                title={groupTitle}
                items={items}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SetsPage;