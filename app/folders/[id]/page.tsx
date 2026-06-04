'use client'

import AddDeckToFolder from '@/components/ui/AddDeckToFolder/AddDeckToFolder';
import DeckList from '@/components/ui/MainDeckList/DeckList';
import { loadCards, loadDecks, loadFolders } from '@/storage';
import { addDeckFolderFlag } from '@/store/AddDeckToFolderStore';
import { RootState } from '@/store/store';
import { Card, Deck, Folder } from '@/types/type';
import { FolderIcon, Plus, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function FolderPage() {
  const params = useParams<{ id: string }>();

  const folderId = params.id;

  const [decks] = useState<Deck[]>(() => loadDecks());
  const [cards] = useState<Card[]>(() => loadCards());
  const folders = useSelector(
    (state: RootState) => state.folders.folders
  );
  const [searchValue, setSearchValue] = useState('');

  const dispatch = useDispatch();

  const currentFolder = folders.find(folder => folder.id === folderId);
  console.log(currentFolder?.deckIds)

  const folderDecks = decks.filter(deck => currentFolder?.deckIds.includes(deck.id)) || []

  const filteredDecks = folderDecks.filter(deck =>
    deck.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredCards = cards.filter(card => filteredDecks.some(deck => deck.id === card.deckId));


  if (!currentFolder) {
    return (
      <section className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-[var(--padding-x-card)] py-[var(--padding-y-card)]">
          Папка не найдена
        </div>
      </section>
    );
  }

  return (
    <section className="w-full min-w-0 px-6 py-8">
        <AddDeckToFolder folderId={currentFolder.id}/>
      <div className="mb-10 flex items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-hover)]">
            <FolderIcon size={44} />
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              {currentFolder.title}
            </h1>

          </div>
        </div>

      </div>

      <div className="mb-10 flex items-center justify-between">

        <div className="relative w-full max-w-md">
          <input
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Поиск по этой папке"
            className="w-full rounded-[var(--radius-card)] bg-[var(--color-hover)] px-5 py-4 pr-12 font-semibold outline-none placeholder:text-white/40"
          />

          <Search
            size={22}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70"
          />
        </div>
      </div>


      {filteredDecks.length === 0 ? (
        <div className=" px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-white/60">
          В этой папке пока нет колод
        </div>
      ) : (
        <DeckList
          decksList={filteredDecks}
          cardsList={filteredCards}
        />
      )}

      <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-[var(--color-hover)] p-3">

        <button
          onClick={() => dispatch(addDeckFolderFlag(true))}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-10 py-3 font-bold text-white"
        >
          <Plus size={20} />
          Добавить модуль
        </button>
      </div>
    </section>
  );
}