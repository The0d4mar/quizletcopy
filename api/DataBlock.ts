import { Bell, Boxes, Folder, Folders, Globe2, House, NotebookIcon, WalletCards } from "lucide-react";

export const sideNavData = {
  stableInner: {
    id: "stableInner",
    title: "",
    headers: ["Главная", "Ваша библиотека", "Колоды сообщества", "Учебные группы", "Уведомления"],
    ways: ["/", "/sets", "/community/decks", "/", "/"],
    icons: [House, Folders, Globe2, Boxes, Bell],
  },
  userFolders: {
    id: "userFolders",
    title: "Ваши папки",
    headers: [],
    icons: [Folder],
    ways: [],
  },
  infoMenu: {
    id: "infoMenu",
    title: "Начните здесь",
    headers: ["Карточки", "Решения от экспертов"],
    icons: [WalletCards, NotebookIcon],
    ways: [],
  },
};

export const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];