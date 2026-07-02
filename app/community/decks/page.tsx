"use client";

import { useCopyPublicDeck, usePublicDecks } from "@/features/decks/usePublicDecks";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo, useState } from "react";

const sortOptions = [
  { label: "\u041d\u0435\u0434\u0430\u0432\u043d\u043e \u043e\u0431\u043d\u043e\u0432\u043b\u0451\u043d\u043d\u044b\u0435", value: "recent" },
  { label: "\u041d\u043e\u0432\u044b\u0435", value: "created" },
  { label: "\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435", value: "popular" },
];

const labels = {
  title: "\u041a\u043e\u043b\u043e\u0434\u044b \u0441\u043e\u043e\u0431\u0449\u0435\u0441\u0442\u0432\u0430",
  subtitle: "\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u043a\u043e\u043b\u043e\u0434\u044b \u0434\u0440\u0443\u0433\u0438\u0445 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u0439. \u0418\u0445 \u043c\u043e\u0436\u043d\u043e \u043e\u0442\u043a\u0440\u044b\u0442\u044c \u0438 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0435\u0431\u0435.",
  searchPlaceholder: "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u043c \u043a\u043e\u043b\u043e\u0434\u0430\u043c",
  sortLabel: "\u0421\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u043a\u0430 \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0445 \u043a\u043e\u043b\u043e\u0434",
  loading: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u043a\u043e\u043b\u043e\u0434\u044b...",
  error: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u043a\u043e\u043b\u043e\u0434\u044b.",
  empty: "\u041f\u0443\u0431\u043b\u0438\u0447\u043d\u044b\u0435 \u043a\u043e\u043b\u043e\u0434\u044b \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u044b.",
  cards: "\u043a\u0430\u0440\u0442.",
  author: "\u0410\u0432\u0442\u043e\u0440",
  open: "\u041e\u0442\u043a\u0440\u044b\u0442\u044c",
  copy: "\u0421\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u0441\u0435\u0431\u0435",
  copying: "\u041a\u043e\u043f\u0438\u0440\u0443\u0435\u043c...",
  ownDeck: "\u0412\u0430\u0448\u0430 \u043a\u043e\u043b\u043e\u0434\u0430",
};

const CommunityDecksPage = () => {
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState("recent");
  const query = useMemo(() => searchValue.trim(), [searchValue]);
  const publicDecksQuery = usePublicDecks({ query, sort });
  const copyDeckMutation = useCopyPublicDeck();
  const decks = publicDecksQuery.data ?? [];
  const currentUserId = session?.user?.id;

  return (
    <section className="mainSection pageStack">
      <header className="pageHeader">
        <div className="pageHeaderBody">
          <h1 className="pageTitle">{labels.title}</h1>
          <p className="pageSubtitle">{labels.subtitle}</p>
        </div>
      </header>

      <div className="toolbar">
        <input className="input max-w-xl" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder={labels.searchPlaceholder} />

        <div className="relative w-full sm:w-fit">
          <select className="selectControl" value={sort} onChange={(event) => setSort(event.target.value)} aria-label={labels.sortLabel}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 text-[var(--colorTextMuted)]" />
        </div>
      </div>

      {publicDecksQuery.isLoading ? (
        <p className="card mutedText">{labels.loading}</p>
      ) : publicDecksQuery.error ? (
        <p className="card appError">{labels.error}</p>
      ) : decks.length === 0 ? (
        <p className="card mutedText">{labels.empty}</p>
      ) : (
        <div className="responsiveGrid">
          {decks.map((deck) => {
            const isOwnDeck = Boolean(currentUserId && deck.ownerId === currentUserId);

            return (
              <article key={deck.id} className="card cardInteractive flex min-h-[220px] flex-col justify-between gap-5">
                <div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="sectionTitle min-w-0 truncate">{deck.title}</h2>
                    <span className="badge">{deck.cardsCount} {labels.cards}</span>
                  </div>

                  {deck.description && <p className="mutedText line-clamp-3">{deck.description}</p>}
                  <p className="metaText mt-4">{labels.author}: {deck.authorName}</p>
                </div>

                <div className="actionRow">
                  <Link className="button" href={`/deck/${deck.id}`}>{labels.open}</Link>
                  {isOwnDeck ? (
                    <span className="button pointer-events-none opacity-70">{labels.ownDeck}</span>
                  ) : (
                    <button className="button" type="button" disabled={copyDeckMutation.isPending} onClick={() => copyDeckMutation.mutate(deck.id)}>
                      {copyDeckMutation.isPending ? labels.copying : labels.copy}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CommunityDecksPage;