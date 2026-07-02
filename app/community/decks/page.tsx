"use client";

import { useCopyPublicDeck, usePublicDecks } from "@/features/decks/usePublicDecks";
import Link from "next/link";
import { useMemo, useState } from "react";

const sortOptions = [
  { label: "Недавно обновлённые", value: "recent" },
  { label: "Новые", value: "created" },
  { label: "Популярные", value: "popular" },
];

const CommunityDecksPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sort, setSort] = useState("recent");
  const query = useMemo(() => searchValue.trim(), [searchValue]);
  const publicDecksQuery = usePublicDecks({ query, sort });
  const copyDeckMutation = useCopyPublicDeck();
  const decks = publicDecksQuery.data ?? [];

  return (
    <section className="mainSection flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold">Колоды сообщества</h1>
        <p className="mt-2 text-[var(--colorTextMuted)]">
          Публичные колоды других пользователей. Их можно открыть, изучать и скопировать себе.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          className="input max-w-xl"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Поиск по публичным колодам"
        />

        <select
          className="input max-w-xs"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Сортировка публичных колод"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {publicDecksQuery.isLoading ? (
        <p className="card text-[var(--colorTextMuted)]">Загружаем публичные колоды...</p>
      ) : publicDecksQuery.error ? (
        <p className="card text-red-400">Не удалось загрузить публичные колоды.</p>
      ) : decks.length === 0 ? (
        <p className="card text-[var(--colorTextMuted)]">Публичные колоды не найдены.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {decks.map((deck) => (
            <article key={deck.id} className="card flex min-h-[220px] flex-col justify-between gap-5">
              <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold">{deck.title}</h2>
                  <span className="rounded-full border border-[var(--colorBorder)] px-3 py-1 text-sm text-[var(--colorTextMuted)]">
                    {deck.cardsCount} карт.
                  </span>
                </div>

                {deck.description && <p className="text-[var(--colorTextMuted)]">{deck.description}</p>}

                <p className="mt-4 text-sm text-[var(--colorTextMuted)]">Автор: {deck.authorName}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="button" href={`/deck/${deck.id}`}>
                  Открыть
                </Link>
                <button
                  className="button"
                  type="button"
                  disabled={copyDeckMutation.isPending}
                  onClick={() => copyDeckMutation.mutate(deck.id)}
                >
                  {copyDeckMutation.isPending ? "Копируем..." : "Скопировать себе"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommunityDecksPage;