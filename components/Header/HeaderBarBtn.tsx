import { Menu } from "lucide-react";

interface HeaderBarBtnProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

const HeaderBarBtn = ({ isSidebarCollapsed, onToggleSidebar }: HeaderBarBtnProps) => {
  return (
    <button
      type="button"
      className="button buttonGhost iconButton"
      aria-label={isSidebarCollapsed ? "\u0420\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044c \u043c\u0435\u043d\u044e" : "\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e"}
      aria-pressed={isSidebarCollapsed}
      onClick={onToggleSidebar}
    >
      <Menu />
    </button>
  );
};

export default HeaderBarBtn;