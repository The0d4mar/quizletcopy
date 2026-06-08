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
import { delCenDeck, delConnectedCards, delFolder, updateFolderList } from '@/api/localFunc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { modalState } from '@/store/modalStore';
import { createFolderCopy, deleteFolder, setFolders } from '@/store/folderStore';
import { foldernameflag } from '@/store/EditFolderName';
import { delDecks } from '@/store/deckStore';
import { setUpdatedCards } from '@/store/cardStore';

interface DropdownMenuProps {
  localId: string;
  windowFlag?: string;
} 

const DropdownMenu: React.FC<DropdownMenuProps> = ({ localId, windowFlag = 'openedDeck' }) => {
    const sendedDeckId = localId;
    const hideFlag = useSelector((state: RootState) => state.modal.state) 
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
        onClick: () => console.log('Создать копию'),
      },
      {
        label: 'Печать',
        icon: Printer ,
        onClick: () => console.log('Создать копию'),
      },
      {
        label: 'Объединить',
        icon: GitMerge ,
        onClick: () => {dispatch(modalState(true))},
      },
      {
        label: 'Экспортировать',
        icon: Download ,
        onClick: () => console.log('Создать копию'),
      },
      {
        label: 'Внедрить',
        icon: Code2 ,
        onClick: () => console.log('Создать копию'),
      },
      {
        label: 'Удалить',
        icon: Trash2 ,
        danger: true,
        onClick: () => {
          dispatch(delDecks(sendedDeckId))
          const decksIds = loadDecks().map(deck => deck.id)
          const newCards = delConnectedCards(loadCards(), sendedDeckId).filter(card => decksIds.includes(card.deckId))
          dispatch(setUpdatedCards(newCards))
          const updatedFolders = updateFolderList(sendedDeckId)
          dispatch(setFolders(updatedFolders))
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
          const updatedFolders = delFolder(localId);
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