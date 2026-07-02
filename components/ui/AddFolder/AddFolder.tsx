"use client";

import { useCreateFolder } from "@/features/folders/useFolders";
import { folderModal } from "@/store/addFolderStore";
import { RootState } from "@/store/store";
import { X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const labels = {
  title: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0430\u043f\u043a\u0443",
  name: "\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043f\u0430\u043f\u043a\u0438",
  placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043d\u0430\u0437\u0432\u0430\u043d\u0438\u0435",
  error: "\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u043f\u0430\u043f\u043a\u0443. \u041f\u043e\u043f\u0440\u043e\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437.",
  adding: "\u0414\u043e\u0431\u0430\u0432\u043b\u044f\u0435\u043c...",
  add: "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c",
  close: "\u0417\u0430\u043a\u0440\u044b\u0442\u044c",
};

const AddFolder = () => {
  const addFolderFlag = useSelector((state: RootState) => state.folderFlag.folderflag);
  const dispatch = useDispatch();
  const createFolderMutation = useCreateFolder();
  const [folderName, setFolderName] = useState("");

  const closeModal = () => {
    setFolderName("");
    dispatch(folderModal(false));
  };

  const createFolder = async () => {
    const trimmedTitle = folderName.trim();

    if (!trimmedTitle) return;

    await createFolderMutation.mutateAsync({
      id: crypto.randomUUID(),
      title: trimmedTitle,
      deckTitles: [],
      deckIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    dispatch(folderModal(false));
    setFolderName("");
  };

  if (!addFolderFlag) return null;

  return (
    <div className="modalOverlay folderModalOverlay">
      <div className="modal folderModal">
        <div className="modalHeader">
          <h2 className="modalTitle">{labels.title}</h2>

          <button type="button" onClick={closeModal} aria-label={labels.close} className="button buttonGhost iconButton modalCloseButton">
            <X size={18} />
          </button>
        </div>

        <div className="sectionBlock">
          <label>
            <span className="metaText mb-2 block">{labels.name}</span>
            <input type="text" value={folderName} onChange={(event) => setFolderName(event.target.value)} placeholder={labels.placeholder} className="input" />
          </label>

          {createFolderMutation.error && <p className="appError">{labels.error}</p>}

          <div className="actionRow justify-end">
            <button type="button" onClick={createFolder} disabled={createFolderMutation.isPending} className="button">
              {createFolderMutation.isPending ? labels.adding : labels.add}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFolder;