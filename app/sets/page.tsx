"use client";

import { createLibraryItems, filterLibraryItems, groupLibraryItems } from "@/api/localFunc";
import LibraryControls from "@/components/ui/LibraryControls/LibraryControls";
import LibraryGroup from "@/components/ui/LibraryGroup/LibraryGroup";
import LibrarySearch from "@/components/ui/LibrarySearch/LibrarySearch";
import { useCards } from "@/features/cards/useCards";
import { useDecks } from "@/features/decks/useDecks";
import { useFolders } from "@/features/folders/useFolders";
import { EntityFilter, SortType } from "@/types/types.type";
import { useMemo, useState } from "react";

const SetsPage = () => {
  const [entityFilter, setEntityFilter] = useState<EntityFilter>("all");
  const [sortType, setSortType] = useState<SortType>("updated");
  const [searchValue, setSearchValue] = useState("");

  const decksQuery = useDecks();
  const decks = decksQuery.data ?? [];
  const cards = useCards(decks).data ?? [];
  const folders = useFolders().data ?? [];

  const libraryItems = useMemo(() => createLibraryItems(decks, cards, folders), [decks, cards, folders]);

  const filteredItems = useMemo(
    () => filterLibraryItems(libraryItems, entityFilter, searchValue, sortType),
    [libraryItems, entityFilter, searchValue, sortType],
  );

  const groupedItems = useMemo(() => groupLibraryItems(filteredItems, sortType), [filteredItems, sortType]);

  return (
    <section className="mainSection">
      <div className="mb-[var(--marginButtom)]">
        <h1 className="pageTitle">
          Ваша библиотека
        </h1>

        <div className="mb-[var(--marginButtom)] flex flex-col gap-[var(--gapXl)] lg:flex-row lg:items-end lg:justify-between">
          <LibraryControls
            entityFilter={entityFilter}
            sortType={sortType}
            onEntityFilterChange={setEntityFilter}
            onSortTypeChange={setSortType}
          />

          <LibrarySearch value={searchValue} onChange={setSearchValue} />
        </div>

        {decksQuery.isLoading ? (
          <div className="px-[var(--paddingCardX)] py-[var(--paddingCardY)] text-[var(--colorTextMuted)]">
            Загружаем библиотеку...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="px-[var(--paddingCardX)] py-[var(--paddingCardY)] text-[var(--colorTextMuted)]">
            Ничего не найдено
          </div>
        ) : (
          <div className="flex flex-col gap-[var(--gapSection)]">
            {Object.entries(groupedItems).map(([groupTitle, items]) => (
              <LibraryGroup key={groupTitle} title={groupTitle} items={items} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SetsPage;