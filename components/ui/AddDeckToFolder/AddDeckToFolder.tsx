"use client";

import { useDecks } from "@/features/decks/useDecks";
import { useAddDeckToFolder, useFolders } from "@/features/folders/useFolders";
import { addDeckFolderFlag } from "@/store/AddDeckToFolderStore";
import { RootState } from "@/store/store";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AddDeckToFolderProps {
  folderId: string;
}

const AddDeckToFolder = ({ folderId }: AddDeckToFolderProps) => {
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const addDeckToFolderFlag = useSelector((state: RootState) => state.adddecktofolderflag.state);
  const dispatch = useDispatch();
  const addDeckMutation = useAddDeckToFolder();

  const folders = useFolders().data ?? [];
  const decks = useDecks().data ?? [];
  const currentFolder = folders.find((folder) => folder.id === folderId);
  const currentFolderDeckIds = currentFolder?.deckIds ?? [];
  const availableDecks = decks.filter((deck) => !currentFolderDeckIds.includes(deck.id));

  const toggleDeck = (deckId: string) => {
    setSelectedDeckIds((prev) =>
      prev.includes(deckId) ? prev.filter((id) => id !== deckId) : [...prev, deckId],
    );
  };

  const handleClose = () => {
    setSelectedDeckIds([]);
    dispatch(addDeckFolderFlag(false));
  };

  const handleAddDecks = async () => {
    if (selectedDeckIds.length === 0) return;

    await Promise.all(selectedDeckIds.map((deckId) => addDeckMutation.mutateAsync({ folderId, deckId })));

    setSelectedDeckIds([]);
    dispatch(addDeckFolderFlag(false));
  };

  return (
    <div className={`${!addDeckToFolderFlag ? "hidden" : "fixed"} inset-0 z-50 flex items-center justify-center bg-black/50`}>
      <div className="w-full max-w-lg rounded-2xl border border-[var(--colorBorder)] bg-black p-6 text-white">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Добавить модули в папку</h2>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--colorBorder)] transition hover:bg-white hover:text-black"
          >
            <X size={18} />
          </button>
        </div>

        {availableDecks.length === 0 ? (
          <div className="rounded-[var(--radiusCard)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] text-white/60">
            Нет доступных модулей для добавления
          </div>
        ) : (
          <ul className="mb-6 flex max-h-[320px] flex-col gap-3 overflow-y-auto">
            {availableDecks.map((deck) => (
              <li key={deck.id}>
                <label className="flex cursor-pointer items-center gap-4 rounded-[var(--radiusCard)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] transition hover:bg-[var(--colorSurfaceMuted)]">
                  <input
                    type="checkbox"
                    checked={selectedDeckIds.includes(deck.id)}
                    onChange={() => toggleDeck(deck.id)}
                    className="h-4 w-4"
                  />

                  <div>
                    <h3 className="font-semibold">{deck.title}</h3>
                    <p className="text-sm text-white/50">Автор: {deck.createdBy}</p>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}

        {addDeckMutation.error && (
          <p className="mb-4 text-sm text-red-400">Не удалось добавить модуль. Попробуй ещё раз.</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-[var(--radiusCard)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] transition hover:bg-white hover:text-black"
          >
            Отмена
          </button>

          <button
            type="button"
            onClick={handleAddDecks}
            disabled={selectedDeckIds.length === 0 || addDeckMutation.isPending}
            className="rounded-[var(--radiusCard)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)] transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {addDeckMutation.isPending ? "Добавляем..." : "Добавить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDeckToFolder;