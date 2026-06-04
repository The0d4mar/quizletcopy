import { Bell, Boxes, Folder, Folders, House, NotebookIcon, WalletCards } from 'lucide-react';

export const sideNavData = {
    stableInner: {
      id: 'stableInner',
      title: '',
      headers: ['Главная', "Ваша библиотека", "Учебные группы", "Уведомления"],
      icons:[House, Folders, Boxes, Bell],
    },
    userFolders:{
      id: 'userFolders',
      title: 'Ваши папки',
      headers: [],
      icons: [Folder],
    },
    infoMenu: {
      id: 'infoMenu',
      title: 'Начинте здесь',
      headers: ["Карточки", "Решения от экспертов"],
      icons: [WalletCards, NotebookIcon],
    },
  }