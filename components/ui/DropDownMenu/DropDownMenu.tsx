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
import { loadCards, loadDecks } from '@/storage';
import { delCenDeck, delConnectedCards } from '@/api/localFunc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { modalState } from '@/store/modalStore';

export default function DropdownMenu({ localId }: { localId: string }) {
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
          delCenDeck(loadDecks(), sendedDeckId)
          delConnectedCards(loadCards(), sendedDeckId)
        },
      },
    ];

    return (
      <div
        className="
          w-[220px]
          overflow-hidden
          rounded-2xl
          border border-[#4a4d70]
          py-2
          shadow-[0_20px_50px_rgba(0,0,0,0.45)]
          absolute
          right-[0]
          mt-3
        "
      >
        {menuItems.map((item) => (
          <DropDownMenuBtn item={item} key={item.label}/>
        ))}
      </div>
    );
}