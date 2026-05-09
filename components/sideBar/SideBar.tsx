import React, {FC} from 'react';
import SideBarChap from './SideBarChap';
import { Bell, Boxes, Folder, Folders, House, NotebookIcon, WalletCards } from 'lucide-react';




const SideBar:FC = () => {
  const innerSideNav = {
    stableInner: {
      title: '',
      headers: ['Главная', "Ваша библиотека", "Учебные группы", "Уведомления"],
      icons:[House, Folders, Boxes, Bell],
    },
    userFolders:{
      title: 'Ваши папки',
      headers: [],
      icons: [Folder],
    },
    infoMenu: {
      title: 'Начинте здесь',
      headers: ["Карточки", "Решения от экспертов"],
      icons: [WalletCards, NotebookIcon],
    },
  }

  return (
    <aside className=' py-6 flex flex-col gap-4 relative'>
      {Object.values(innerSideNav).map((item, index, array) => (
        <React.Fragment key={index}>
          <SideBarChap
            title={item.title}
            headers={item.headers}
            icons={item.icons}
          />

          {index !== array.length - 1 && (
            <div className='relative w-full h-0.5 bg-white rounded-2xl' />
          )}
        </React.Fragment>
      ))}
    </aside>
  );
};

export default SideBar;