'use client'

import { loadDecks, loadFolders, saveFolders } from '@/storage';
import { addDeckFolderFlag } from '@/store/AddDeckToFolderStore';
import { setFolders } from '@/store/folderStore';
import { RootState } from '@/store/store';
import { Deck, Folder } from '@/types/type';
import { X } from 'lucide-react';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface AddDeckToFolderProps {
  folderId: string;

}

const AddDeckToFolder: FC<AddDeckToFolderProps> = ({
  folderId,
}) => {
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const addDeckToFolderFlag = useSelector(
    (state: RootState) => state.adddecktofolderflag.state
  );

  const dispatch = useDispatch();

  const folders = loadFolders();
  const decks = loadDecks();

  const currentFolder = folders.find(folder => folder.id === folderId);

  const currentFolderDeckIds = currentFolder?.deckIds ?? [];

  const availableDecks = decks.filter(
    deck => !currentFolderDeckIds.includes(deck.id)
  );

  const toggleDeck = (deckId: string) => {
    setSelectedDeckIds(prev =>
      prev.includes(deckId)
        ? prev.filter(id => id !== deckId)
        : [...prev, deckId]
    );
  };

  const handleClose = () => {
    setSelectedDeckIds([]);
    dispatch(addDeckFolderFlag(false))
  };

  const handleAddDecks = () => {
    if (selectedDeckIds.length === 0) return;

    const updatedFolders: Folder[] = folders.map(folder => {
      if (folder.id !== folderId) {
        return folder;
      }

      return {
        ...folder,
        deckIds: [...folder.deckIds, ...selectedDeckIds],
        updatedAt: new Date().toISOString(),
      };
    });

    saveFolders(updatedFolders);
    dispatch(setFolders(updatedFolders));

    setSelectedDeckIds([]);
    dispatch(addDeckFolderFlag(false))
  };


  return (
    <div className={`${!addDeckToFolderFlag ? 'hidden' : 'fixed'
    } inset-0 z-50 flex items-center justify-center bg-black/50`}>
      <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-black p-6 text-white">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Добавить модули в папку
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] transition hover:bg-white hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        {availableDecks.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-white/60">
            Нет доступных модулей для добавления
          </div>
        ) : (
          <ul className="mb-6 flex max-h-[320px] flex-col gap-3 overflow-y-auto">
            {availableDecks.map(deck => (
              <li key={deck.id}>
                <label className="flex cursor-pointer items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-border)] px-[var(--padding-x-card)] py-[var(--padding-y-card)] transition hover:bg-[var(--color-hover)]">
                  <input
                    type="checkbox"
                    checked={selectedDeckIds.includes(deck.id)}
                    onChange={() => toggleDeck(deck.id)}
                    className="h-4 w-4"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {deck.title}
                    </h3>

                    <p className="text-sm text-white/50">
                      Автор: {deck.createdBy}
                    </p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-[var(--padding-x-card)] py-[var(--padding-y-card)] transition hover:bg-white hover:text-black"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleAddDecks}
            disabled={selectedDeckIds.length === 0}
            className="
              rounded-[var(--radius-card)]
              border border-[var(--color-border)]
              px-[var(--padding-x-card)]
              py-[var(--padding-y-card)]
              transition
              hover:bg-white
              hover:text-black
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDeckToFolder;