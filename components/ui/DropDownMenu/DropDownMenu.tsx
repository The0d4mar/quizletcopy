import {
  Pencil,
  Copy,
  Printer,
  GitMerge,
  Download,
  Code2,
  Trash2,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import DropDownMenuBtn from './DropDownMenuBtn';
import { loadCards, loadDecks, loadFolders } from '@/storage';
import { createDeckCopy, delCenDeck, delConnectedCardData, delConnectedCards, delFolder, removeDeckFromFolders } from '@/api/localFunc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { modalState } from '@/store/modalStore';
import { createFolderCopy, deleteFolder, setFolders } from '@/store/folderStore';
import { foldernameflag } from '@/store/EditFolderName';
import { delDecks, setDecks } from '@/store/deckStore';
import { setUpdatedCards } from '@/store/cardStore';
import { setCardData } from '@/store/cardDataStore';

interface DropdownMenuProps {
  localId: string;
  windowFlag?: string;
} 

const DropdownMenu: React.FC<DropdownMenuProps> = ({ localId, windowFlag = 'openedDeck' }) => {
    const sendedDeckId = localId;
    const hideFlag = useSelector((state: RootState) => state.modal.state) 
    const folders = useSelector((state: RootState) => state.folders.folders);
    const decks = useSelector((state: RootState) => state.deckStore.decks);
    const cards = useSelector((state: RootState) => state.cardStore.cards);
    const cardData = useSelector((state: RootState) => state.cardDataStore.cardData);
    const dispatch = useDispatch();
    const menuItems = [
      {
        label: 'Редактировать',
        icon: Pencil ,
        way: `${sendedDeckId}/deckEdit/{state="renderDeck"}`,
        onClick: () => console.log('Редактировать'),
      },
      {
        label: 'Создать копию',
        icon: Copy ,
        onClick: () => {
          const result = createDeckCopy(
            decks,
            cards,
            sendedDeckId
          );

          if (!result) return;

          dispatch(setDecks(result.decks));
          dispatch(setUpdatedCards(result.cards));
        },
      },
      {
        label: 'Объединить',
        icon: GitMerge ,
        onClick: () => {dispatch(modalState(true))},
      },
      {
        label: 'Удалить',
        icon: Trash2 ,
        danger: true,
        onClick: () => {
          dispatch(delDecks(sendedDeckId));

            const updatedCards = delConnectedCards(
              cards,
              sendedDeckId
            );

            dispatch(setUpdatedCards(updatedCards));

            const updatedCardData = delConnectedCardData(
              cards,
              cardData,
              sendedDeckId
            );

            dispatch(setCardData(updatedCardData));

            const updatedFolders = removeDeckFromFolders(
              folders,
              sendedDeckId
            );

            dispatch(setFolders(updatedFolders));
        },
      },
    ];

    const folderMenu = [
      {
        label: 'Редактировать',
        icon: Pencil ,
        onClick: () => {

          dispatch(foldernameflag(true))
          
        },
      },
      {
        label: 'Создать копию',
        icon: Copy ,
        onClick: () => {
          dispatch(createFolderCopy({ folderId: localId }))
        },
      },
      {
        label: 'Удалить',
        icon: Trash2 ,
        danger: true,
        onClick: () => {
          const updatedFolders = delFolder(folders, localId);
          dispatch(setFolders(updatedFolders));
        },
      },
    ];

    const sendedMenuData = windowFlag === 'openedDeck' ? menuItems : folderMenu;

    return (
      <div
        className="
          w-[220px]
          overflow-hidden
          rounded-2xl
          border border-[var(--color-border-strong)]
          shadow-[var(--shadow-modal)]
          bg-[var(--color-bg)]
          absolute
          right-[0]
          mt-3
        "
      >
        {sendedMenuData.map((item) => (
          <DropDownMenuBtn item={item} key={item.label}/>
        ))}
      </div>
    );
}

export default DropdownMenu;