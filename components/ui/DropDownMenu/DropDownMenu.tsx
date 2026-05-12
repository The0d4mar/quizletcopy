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

export default function DropdownMenu({ localId }: { localId: string }) {
    const sendedDeckId = localId;
    const menuItems = [
      {
        label: 'Редактировать',
        icon: Pencil ,
        way: `${sendedDeckId}/deckEdit/{state="renderDeck"}`
      },
      {
        label: 'Создать копию',
        icon: Copy ,
      },
      {
        label: 'Печать',
        icon: Printer ,
      },
      {
        label: 'Объединить',
        icon: GitMerge ,
      },
      {
        label: 'Экспортировать',
        icon: Download ,
      },
      {
        label: 'Внедрить',
        icon: Code2 ,
      },
      {
        label: 'Удалить',
        icon: Trash2 ,
        danger: true,
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