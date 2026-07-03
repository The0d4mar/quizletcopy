"use client";

import { useCards } from "@/features/cards/useCards";
import { useDecks } from "@/features/decks/useDecks";
import { useFolders } from "@/features/folders/useFolders";
import { SearchResult } from "@/types/types.type";
import { FolderIcon, IdCardLanyard, Languages, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const labels = {
  search: "\u041f\u043e\u0438\u0441\u043a",
  openSearch: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u0438\u0441\u043a",
  closeSearch: "\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u0438\u0441\u043a",
  deck: "\u041c\u043e\u0434\u0443\u043b\u044c",
  folder: "\u041f\u0430\u043f\u043a\u0430",
  noDeck: "\u0411\u0435\u0437 \u043a\u043e\u043b\u043e\u0434\u044b",
  empty: "\u041d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e",
};

const HeaderSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const decksQuery = useDecks();
  const foldersQuery = useFolders();
  const decks = useMemo(() => decksQuery.data ?? [], [decksQuery.data]);
  const folders = useMemo(() => foldersQuery.data ?? [], [foldersQuery.data]);
  const cardsQuery = useCards(decks);
  const cards = useMemo(() => cardsQuery.data ?? [], [cardsQuery.data]);

  const normalizedSearch = searchValue.trim().toLowerCase();

  const results = useMemo<SearchResult[]>((() => {
    if (!normalizedSearch) return [];

    const deckResults: SearchResult[] = decks
      .filter((deck) => deck.title.toLowerCase().includes(normalizedSearch))
      .map((deck) => ({
        type: "deck",
        id: deck.id,
        title: deck.title,
        subtitle: labels.deck,
        href: `/deck/${deck.id}`,
      }));

    const folderResults: SearchResult[] = folders
      .filter((folder) => folder.title.toLowerCase().includes(normalizedSearch))
      .map((folder) => ({
        type: "folder",
        id: folder.id,
        title: folder.title,
        subtitle: labels.folder,
        href: `/folders/${folder.id}`,
      }));

    const cardResults: SearchResult[] = cards
      .filter(
        (card) =>
          card.original.toLowerCase().includes(normalizedSearch) ||
          card.translation.toLowerCase().includes(normalizedSearch),
      )
      .map((card) => {
        const parentDeck = decks.find((deck) => deck.id === card.deckId);

        return {
          type: "card",
          id: card.id,
          title: card.original,
          subtitle: `${card.translation} В· ${parentDeck?.title ?? labels.noDeck}`,
          href: `/deck/${card.deckId}`,
        };
      });

    return [...deckResults, ...folderResults, ...cardResults].slice(0, 8);
  }), [normalizedSearch, decks, folders, cards]);

  const getIcon = (type: SearchResult["type"]) => {
    if (type === "deck") return <IdCardLanyard size={20} />;
    if (type === "folder") return <FolderIcon size={20} />;

    return <Languages size={20} />;
  };

  const clearSearch = () => {
    setSearchValue("");
    setIsMobileSearchOpen(false);
  };

  const searchBody = (
    <div className="headerSearchBox">
      <Search className="headerSearchIcon" size={20} aria-hidden="true" />
      <input
        type="text"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder={labels.search}
        className="input headerSearchInput"
        autoFocus={isMobileSearchOpen}
      />

      {searchValue.trim() && (
        <div className="inputSearh">
          {results.length === 0 ? (
            <div className="px-[var(--paddingCardX)] py-[var(--paddingCardY)] text-[var(--colorTextMuted)]">
              {labels.empty}
            </div>
          ) : (
            <div className="flex max-h-[360px] flex-col overflow-y-auto scrollArea">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={clearSearch}
                  className="flex items-center gap-3 px-[var(--paddingCardX)] py-[var(--paddingCardY)] transition hover:bg-[var(--colorBgSoft)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radiusCard)] bg-[var(--colorBgSoft)]">
                    {getIcon(result.type)}
                  </span>

                  <span className="min-w-0">
                    <span className="block max-w-[280px] truncate font-bold">{result.title}</span>
                    <span className="block max-w-[280px] truncate text-sm text-[var(--colorTextMuted)]">{result.subtitle}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="headerSearchRoot">
      <div className="headerSearchDesktop">{searchBody}</div>

      <button className="button buttonGhost iconButton headerSearchMobileTrigger" type="button" aria-label={labels.openSearch} onClick={() => setIsMobileSearchOpen(true)}>
        <Search size={22} />
      </button>

      {isMobileSearchOpen && (
        <div className="mobileSearchOverlay" role="dialog" aria-modal="true" aria-label={labels.search}>
          <div className="mobileSearchPanel">
            {searchBody}
            <button className="button buttonGhost iconButton" type="button" aria-label={labels.closeSearch} onClick={() => setIsMobileSearchOpen(false)}>
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;