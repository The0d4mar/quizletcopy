import { Menu } from 'lucide-react';
import React from 'react';

interface HeaderBarBtnProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const HeaderBarBtn = ({ isSidebarCollapsed, onToggleSidebar }: HeaderBarBtnProps) => {
  return (
    <button
      type="button"
      className="button buttonGhost iconButton"
      aria-label={isSidebarCollapsed ? 'Развернуть боковое меню' : 'Свернуть боковое меню'}
      aria-pressed={isSidebarCollapsed}
      onClick={onToggleSidebar}
    >
      <Menu />
    </button>
  );
};

export default HeaderBarBtn;
