import {
  Pencil,
  Copy,
  GitMerge,
  Trash2,
} from "lucide-react";
import DropDownMenuBtn from "./DropDownMenuBtn";
import { createDeckCopy, delConnectedCardData, delConnectedCards, delFolder, removeDeckFromFolders } from "@/api/localFunc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { modalState } from "@/store/modalStore";
import { createFolderCopy, setFolders } from "@/store/folderStore";
import { foldernameflag } from "@/store/EditFolderName";
import { deleteDeckFromApi, saveDeckToApi } from "@/store/deckStore";
import { setUpdatedCards } from "@/store/cardStore";
import { setCardData } from "@/store/cardDataStore";
import { useAppDispatch } from "@/store/hooks";

const labels = {
  edit: "\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c",
  copy: "\u0421\u043e\u0437\u0434\u0430\u0442\u044c \u043a\u043e\u043f\u0438\u044e",
  merge: "\u041e\u0431\u044a\u0435\u0434\u0438\u043d\u0438\u0442\u044c",
  delete: "\u0423\u0434\u0430\u043b\u0438\u0442\u044c",
};

interface DropdownMenuProps {
  localId: string;
  windowFlag?: string;
}

const DropdownMenu = ({ localId, windowFlag = "openedDeck" }: DropdownMenuProps) => {
  const sendedDeckId = localId;
  const folders = useSelector((state: RootState) => state.folders.folders);
  const decks = useSelector((state: RootState) => state.deckStore.decks);
  const cards = useSelector((state: RootState) => state.cardStore.cards);
  const cardData = useSelector((state: RootState) => state.cardDataStore.cardData);
  const dispatch = useAppDispatch();

  const menuItems = [
    {
      label: labels.edit,
      icon: Pencil,
      way: `${sendedDeckId}/deckEdit/{state="renderDeck"}`,
    },
    {
      label: labels.copy,
      icon: Copy,
      onClick: () => {
        const result = createDeckCopy(decks, cards, sendedDeckId);

        if (!result) return;

        const copiedDeck = result.decks.find((deck) => deck.id === result.newDeckId);

        if (!copiedDeck) return;

        dispatch(saveDeckToApi(copiedDeck));
        dispatch(setUpdatedCards(result.cards));
      },
    },
    {
      label: labels.merge,
      icon: GitMerge,
      onClick: () => {
        dispatch(modalState(true));
      },
    },
    {
      label: labels.delete,
      icon: Trash2,
      danger: true,
      onClick: () => {
        dispatch(deleteDeckFromApi(sendedDeckId));

        const updatedCards = delConnectedCards(cards, sendedDeckId);
        dispatch(setUpdatedCards(updatedCards));

        const updatedCardData = delConnectedCardData(cards, cardData, sendedDeckId);
        dispatch(setCardData(updatedCardData));

        const updatedFolders = removeDeckFromFolders(folders, sendedDeckId);
        dispatch(setFolders(updatedFolders));
      },
    },
  ];

  const folderMenu = [
    {
      label: labels.edit,
      icon: Pencil,
      onClick: () => {
        dispatch(foldernameflag(true));
      },
    },
    {
      label: labels.copy,
      icon: Copy,
      onClick: () => {
        dispatch(createFolderCopy({ folderId: localId }));
      },
    },
    {
      label: labels.delete,
      icon: Trash2,
      danger: true,
      onClick: () => {
        const updatedFolders = delFolder(folders, localId);
        dispatch(setFolders(updatedFolders));
      },
    },
  ];

  const sendedMenuData = windowFlag === "openedDeck" ? menuItems : folderMenu;

  return (
    <div className="dropdownMenuPanel">
      {sendedMenuData.map((item) => (
        <DropDownMenuBtn item={item} key={item.label} />
      ))}
    </div>
  );
};

export default DropdownMenu;