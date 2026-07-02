"use client";

import AddDeckToFolder from "@/components/ui/AddDeckToFolder/AddDeckToFolder";
import DropDownDeckMenu from "@/components/ui/DropDownDeck/DropDownDeckMenu";
import DeckList from "@/components/ui/MainDeckList/DeckList";
import { useDecks } from "@/features/decks/useDecks";
import { useFolders, useUpdateFolder } from "@/features/folders/useFolders";
import { addDeckFolderFlag } from "@/store/AddDeckToFolderStore";
import { foldernameflag } from "@/store/EditFolderName";
import { RootState } from "@/store/store";
import { FolderIcon, Plus, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const labels = {
  loading: "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043c \u043f\u0430\u043f\u043a\u0443...",
  notFound: "\u041f\u0430\u043f\u043a\u0430 \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u0430",
  folderNamePlaceholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043f\u0430\u043f\u043a\u0438",
  saving: "\u0421\u043e\u0445\u0440\u0430\u043d\u044f\u0435\u043c...",
  save: "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",
  cancel: "\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c",
  searchPlaceholder: "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u044d\u0442\u043e\u0439 \u043f\u0430\u043f\u043a\u0435",
  empty: "\u0412 \u044d\u0442\u043e\u0439 \u043f\u0430\u043f\u043a\u0435 \u043f\u043e\u043a\u0430 \u043d\u0435\u0442 \u043a\u043e\u043b\u043e\u0434",
  addDeck: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043b\u043e\u0434\u0443",
};

const FolderPage = () => {
  const params = useParams<{ id: string }>();
  const folderId = params.id;
  const dispatch = useDispatch();
  const updateFolderMutation = useUpdateFolder();

  const foldersQuery = useFolders();
  const decksQuery = useDecks();
  const folders = foldersQuery.data ?? [];
  const decks = decksQuery.data ?? [];

  const [searchValue, setSearchValue] = useState("");
  const changeFolderNameFlag = useSelector((state: RootState) => state.folderChangeNameFlag.state);

  const currentFolder = folders.find((folder) => folder.id === folderId);
  const folderNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!changeFolderNameFlag) return;

    folderNameInputRef.current?.focus();
    folderNameInputRef.current?.select();
  }, [changeFolderNameFlag]);

  const folderDecks = decks.filter((deck) => currentFolder?.deckIds.includes(deck.id)) || [];
  const filteredDecks = folderDecks.filter((deck) => deck.title.toLowerCase().includes(searchValue.toLowerCase()));

  const changeFolderName = async () => {
    if (!currentFolder) return;

    await updateFolderMutation.mutateAsync({
      ...currentFolder,
      title: folderNameInputRef.current?.value.trim() || currentFolder.title,
    });
    dispatch(foldernameflag(false));
  };

  const cancelChangeFolderName = () => {
    dispatch(foldernameflag(false));
  };

  if (foldersQuery.isLoading || decksQuery.isLoading) {
    return (
      <section className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="rounded-[var(--radiusCard)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)]">
          {labels.loading}
        </div>
      </section>
    );
  }

  if (!currentFolder) {
    return (
      <section className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="rounded-[var(--radiusCard)] border border-[var(--colorBorder)] px-[var(--paddingCardX)] py-[var(--paddingCardY)]">
          {labels.notFound}
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex-1 w-full">
      <AddDeckToFolder folderId={currentFolder.id} />

      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[var(--radiusCard)] bg-[var(--colorSurfaceMuted)]">
            <FolderIcon size={44} />
          </div>

          <div className="flex items-start justify-between">
            {!changeFolderNameFlag ? (
              <h1 className="max-w-[700px] truncate text-4xl font-bold">{currentFolder.title}</h1>
            ) : (
              <div className="flex items-center gap-4">
                <input
                  ref={folderNameInputRef}
                  defaultValue={currentFolder.title}
                  placeholder={labels.folderNamePlaceholder}
                  className="w-full rounded-[var(--radiusCard)] bg-[var(--colorSurfaceMuted)] px-5 py-4 pr-12 font-semibold outline-none placeholder:text-white/40"
                />

                <button
                  className="flex items-center justify-center rounded-xl border px-[var(--paddingCardX)] py-[var(--paddingCardY)]"
                  onClick={changeFolderName}
                  disabled={updateFolderMutation.isPending}
                >
                  {updateFolderMutation.isPending ? labels.saving : labels.save}
                </button>

                <button
                  className="flex items-center justify-center rounded-xl border border-red-500 px-[var(--paddingCardX)] py-[var(--paddingCardY)] text-red-500"
                  onClick={cancelChangeFolderName}
                >
                  {labels.cancel}
                </button>
              </div>
            )}
          </div>
        </div>

        <DropDownDeckMenu localId={folderId} windowFlag="folder" />
      </div>

      <div className="mb-10 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-[var(--radiusCard)] bg-[var(--colorSurfaceMuted)] px-5 py-4 pr-12 font-semibold outline-none placeholder:text-white/40"
          />

          <Search size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70" />
        </div>
      </div>

      {filteredDecks.length === 0 ? (
        <div className="px-[var(--paddingCardX)] py-[var(--paddingCardY)] text-white/60">
          {labels.empty}
        </div>
      ) : (
        <DeckList currentFolder={currentFolder} folderId={currentFolder.id} searchValue={searchValue} />
      )}

      <div className="fixed bottom-8 left-1/2 flex -translate-x-1/2 gap-4 rounded-full bg-[var(--colorSurfaceMuted)] p-3">
        <button
          onClick={() => dispatch(addDeckFolderFlag(true))}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-10 py-3 font-bold text-white"
        >
          <Plus size={20} />
          {labels.addDeck}
        </button>
      </div>
    </section>
  );
};

export default FolderPage;
