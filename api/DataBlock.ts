import { Bell, Boxes, Folder, Folders, House, NotebookIcon, WalletCards } from 'lucide-react';

export const sideNavData = {
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