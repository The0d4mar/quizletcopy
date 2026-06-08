'use client'

import AddDeckToFolder from '@/components/ui/AddDeckToFolder/AddDeckToFolder';
import DropDownDeckMenu from '@/components/ui/DropDownDeck/DropDownDeckMenu';
import DeckList from '@/components/ui/MainDeckList/DeckList';
import { loadCards, loadDecks } from '@/storage';
import { addDeckFolderFlag } from '@/store/AddDeckToFolderStore';
import { foldernameflag } from '@/store/EditFolderName';
import { setFolders } from '@/store/folderStore';
import { RootState } from '@/store/store';
import { Card, Deck } from '@/types/type';
import { FolderIcon, Plus, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function FolderPage() {
  const params = useParams<{ id: string }>();

  const folderId = params.id;

  const [decks] = useState<Deck[]>(useSelector((state: RootState) => state.deckStore.decks));
  const [cards] = useState<Card[]>((useSelector((state: RootState) => state.cardStore.cards)));

  const folders = useSelector(
    (state: RootState) => state.folders.folders
  );

  const [searchValue, setSearchValue] = useState('');

  const changeFolderNameFlag = useSelector(
    (state: RootState) => state.folderChangeNameFlag.state
  );

  const dispatch = useDispatch();

  const currentFolder = folders.find(
    folder => folder.id === folderId
  );

  const [folderName, setFolderName] = useState<string>(
    currentFolder?.title || ''
  );

  const folderNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!changeFolderNameFlag) return;

    folderNameInputRef.current?.focus();
    folderNameInputRef.current?.select();
  }, [changeFolderNameFlag]);

  const folderDecks =
    decks.filter(deck =>
      currentFolder?.deckIds.includes(deck.id)
    ) || [];

  const filteredDecks = folderDecks.filter(deck =>
    deck.title
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  const filteredCards = cards.filter(card =>
    filteredDecks.some(deck => deck.id === card.deckId)
  );

  const changeFolderName = () => {
    const updatedFolders = folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          title: folderName,
        };
      }

      return folder;
    });

    dispatch(setFolders(updatedFolders));
    dispatch(foldernameflag(false));
  };

  const cancelChangeFolderName = () => {
    setFolderName(currentFolder?.title || '');
    dispatch(foldernameflag(false));
  };

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
    <section className="relative flex-1 w-full">
      <AddDeckToFolder folderId={currentFolder.id} />

      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-hover)]">
            <FolderIcon size={44} />
          </div>

          <div className="flex items-start justify-between">
            {!changeFolderNameFlag ? (
              <h1 className="max-w-[700px] truncate text-4xl font-bold">
                {currentFolder.title}
              </h1>
            ) : (
              <div className="flex items-center gap-4">
                <input
                  ref={folderNameInputRef}
                  value={folderName}
                  onChange={e => setFolderName(e.target.value)}
                  placeholder="Введите название папки"
                  className="w-full rounded-[var(--radius-card)] bg-[var(--color-hover)] px-5 py-4 pr-12 font-semibold outline-none placeholder:text-white/40"
                />

                <button
                  className="flex items-center justify-center rounded-xl border px-[var(--padding-x-card)] py-[var(--padding-y-card)]"
                  onClick={changeFolderName}
                >
                  Изменить
                </button>

                <button
                  className="flex items-center justify-center rounded-xl border border-red-500 px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-red-500"
                  onClick={cancelChangeFolderName}
                >
                  Отменить
                </button>
              </div>
            )}
          </div>
        </div>

        <DropDownDeckMenu
          localId={folderId}
          windowFlag="folder"
        />
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
        <div className="px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-white/60">
          В этой папке пока нет колод
        </div>
      ) : (
        <DeckList
            currentFolder = {currentFolder}
            folderId = {currentFolder.id}
            searchValue = {searchValue}
        />
      )}

      <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-[var(--color-hover)] p-3">
        <button
          onClick={() =>
            dispatch(addDeckFolderFlag(true))
          }
          className="flex items-center gap-2 rounded-full bg-blue-600 px-10 py-3 font-bold text-white"
        >
          <Plus size={20} />
          Добавить модуль
        </button>
      </div>
    </section>
  );
}