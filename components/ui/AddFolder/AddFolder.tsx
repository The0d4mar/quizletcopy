'use client'

import { RootState } from '@/store/store';
import { folderModal } from '@/store/addFolderStore';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Folder } from '@/types/type';
import { saveFolders } from '@/storage';
import { addFolder } from '@/store/folderStore';

const AddFolder = () => {
  const addFolderFlag = useSelector(
    (state: RootState) => state.folderFlag.folderflag
  );

  const dispatch = useDispatch();
  const [folderName, setFolderName] = useState('');

  const closeModal = () => {
    setFolderName('');
    dispatch(folderModal(false));
  };

  const createFolder = () => {
  const trimmedTitle = folderName.trim();

  if (!trimmedTitle) return;

  const newFolder = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    deckTitles: [],
    deckIds: [],
  };

  dispatch(addFolder(newFolder));
  dispatch(folderModal(false));
  setFolderName('');
};

  return (
    <div
      className={`
        ${!addFolderFlag ? 'hidden' : 'flex'}
        fixed inset-0 z-50 items-center justify-center bg-black/50
      `}
    >
      <div className="w-full max-w-lg rounded-2xl border border-white bg-black p-6 text-white">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Создать папку
          </h2>

          <button
            type="button"
            onClick={closeModal}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white transition hover:bg-white hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm text-white/70">
            Название папки
          </label>

          <input
            type="text"
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
            placeholder="Введите название"
            className="w-full rounded-xl border border-white bg-transparent px-4 py-3 outline-none placeholder:text-white/40 focus:border-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={createFolder}
            className="rounded-[var(--radius-card)] border border-white px-[var(--padding-x-card)] py-[var(--padding-y-card)] transition hover:bg-white hover:text-black"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFolder;