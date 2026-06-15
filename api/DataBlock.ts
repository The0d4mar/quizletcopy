import { Bell, Boxes, Folder, Folders, House, NotebookIcon, WalletCards } from 'lucide-react';

export const sideNavData = {
    stableInner: {
      id: 'stableInner',
      title: '',
      headers: ['Главная', "Ваша библиотека", "Учебные группы", "Уведомления"],
      ways: ['/', '/sets', '/', '/'],
      icons:[House, Folders, Boxes, Bell],
    },
    userFolders:{
      id: 'userFolders',
      title: 'Ваши папки',
      headers: [],
      icons: [Folder],
      ways: [],
    },
    infoMenu: {
      id: 'infoMenu',
      title: 'Начинте здесь',
      headers: ["Карточки", "Решения от экспертов"],
      icons: [WalletCards, NotebookIcon],
      ways: [],
    },
  }


  export const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];