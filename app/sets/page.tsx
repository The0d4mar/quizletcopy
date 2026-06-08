'use client'

import { loadCards, loadDecks, loadFolders } from '@/storage';
import { RootState } from '@/store/store';
import { Card, Deck, Folder } from '@/types/type';
import { FolderIcon, IdCardLanyard, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

type LibraryItem =
  | {
      type: 'deck';
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      viewedAt?: string;
      cardsCount: number;
      href: string;
    }
  | {
      type: 'folder';
      id: string;
      title: string;
      createdAt: string;
      updatedAt: string;
      viewedAt?: string;
      modulesCount: number;
      href: string;
    };

type EntityFilter = 'all' | 'decks' | 'folders';
type SortType = 'created' | 'updated' | 'viewed';

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isThisWeek(date: Date) {
  const now = new Date();

  const currentDay = now.getDay() || 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - currentDay + 1);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return date >= monday && date <= sunday && !isSameDay(date, now);
}

function getMonthGroupTitle(date: Date) {
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function getSortDate(item: LibraryItem, sortType: SortType) {
  if (sortType === 'created') return item.createdAt;
  if (sortType === 'updated') return item.updatedAt;

  return item.viewedAt ?? item.updatedAt;
}

function getGroupTitle(item: LibraryItem, sortType: SortType) {
  const date = new Date(getSortDate(item, sortType));
  const today = new Date();

  if (isSameDay(date, today)) {
    return 'Сегодня';
  }

  if (isThisWeek(date)) {
    return 'На этой неделе';
  }

  return getMonthGroupTitle(date);
}

const SetsPage = () => {
  const [decks] = useState<Deck[]>(() => loadDecks());
  const [cards] = useState<Card[]>(() => loadCards());

  const [folders] = useState<Folder[]>(() => loadFolders());

  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [sortType, setSortType] = useState<SortType>('updated');
  const [searchValue, setSearchValue] = useState('');

  const libraryItems = useMemo<LibraryItem[]>(() => {
    const deckItems: LibraryItem[] = decks.map(deck => ({
      type: 'deck',
      id: deck.id,
      title: deck.title,
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
      viewedAt: deck.lastRepeat,
      cardsCount: cards.filter(card => card.deckId === deck.id).length,
      href: `/deck/${deck.id}`,
    }));

    const folderItems: LibraryItem[] = folders.map(folder => ({
      type: 'folder',
      id: folder.id,
      title: folder.title,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
      modulesCount: folder.deckIds.length,
      href: `/folders/${folder.id}`,
    }));

    return [...deckItems, ...folderItems];
  }, [decks, cards, folders]);

  const filteredItems = useMemo(() => {
    return libraryItems
      .filter(item => {
        if (entityFilter === 'decks') return item.type === 'deck';
        if (entityFilter === 'folders') return item.type === 'folder';

        return true;
      })
      .filter(item =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(getSortDate(a, sortType)).getTime();
        const dateB = new Date(getSortDate(b, sortType)).getTime();

        return dateB - dateA;
      });
  }, [libraryItems, entityFilter, searchValue, sortType]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce<Record<string, LibraryItem[]>>((acc, item) => {
      const groupTitle = getGroupTitle(item, sortType);

      if (!acc[groupTitle]) {
        acc[groupTitle] = [];
      }

      acc[groupTitle].push(item);

      return acc;
    }, {});
  }, [filteredItems, sortType]);

  return (
    <section className="relative flex-1 w-full">
      <div className="mb-14">
        <h1 className="mb-10 text-4xl font-bold">
          Ваша библиотека
        </h1>

        <div className="mb-14 flex items-center gap-3">
          <button
            onClick={() => setEntityFilter('all')}
            className={`
              rounded-full border border-[var(--color-border)] px-5 py-2 font-bold
              ${entityFilter === 'all' ? 'bg-transparent' : 'bg-[var(--color-hover)] border-transparent'}
            `}
          >
            Все
          </button>

          <button
            onClick={() => setEntityFilter('decks')}
            className={`
              rounded-full px-5 py-2 font-bold
              ${entityFilter === 'decks' ? 'border border-[var(--color-border)]' : 'bg-[var(--color-hover)]'}
            `}
          >
            Модули
          </button>

          <button
            onClick={() => setEntityFilter('folders')}
            className={`
              rounded-full px-5 py-2 font-bold
              ${entityFilter === 'folders' ? 'border border-[var(--color-border)]' : 'bg-[var(--color-hover)]'}
            `}
          >
            Папки
          </button>
        </div>

        <div className="mb-12 flex items-center justify-between gap-8">
          <select
            value={sortType}
            onChange={e => setSortType(e.target.value as SortType)}
            className="rounded-full bg-[var(--color-hover)] px-5 py-3 font-bold outline-none"
          >
            <option value="created">Недавно созданные</option>
            <option value="updated">Недавно измененные</option>
            <option value="viewed">Недавно просмотренные</option>
          </select>

          <div className="relative w-full max-w-xl">
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Найти карточки"
              className="w-full rounded-[var(--radius-card)] bg-[var(--color-hover)] px-5 py-4 pr-12 font-semibold outline-none placeholder:text-white/40"
            />

            <Search
              size={22}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-white/60">
            Ничего не найдено
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            {Object.entries(groupedItems).map(([groupTitle, items]) => (
              <div key={groupTitle}>
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-wide">
                    {groupTitle}
                  </h2>

                  <div className="h-px flex-1 bg-[var(--color-border)] opacity-40" />
                </div>

                <div className="flex flex-col gap-3">
                  {items.map(item => (
                    <Link
                      key={`${item.type}-${item.id}`}
                      href={item.href}
                      className="
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-[var(--radius-card)]
                        bg-[var(--color-hover)]
                        px-[var(--padding-x-card)]
                        py-[var(--padding-y-card)]
                        transition
                        hover:brightness-110
                      "
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-black/20">
                        {item.type === 'deck' ? (
                          <IdCardLanyard size={24} />
                        ) : (
                          <FolderIcon size={24} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="max-w-[520px] truncate text-lg font-bold">
                          {item.title}
                        </h3>

                        <p className="text-sm font-semibold text-white/70">
                          {item.type === 'deck'
                            ? `${item.cardsCount} карточек · Модуль`
                            : `${item.modulesCount} модулей · Папка`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SetsPage;