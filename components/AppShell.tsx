"use client";

import { useState } from "react";

import Header from "@/components/Header/Header";
import SideBar from "@/components/sideBar/SideBar";
import AddFolder from "@/components/ui/AddFolder/AddFolder";
import AppDataHydrator from "@/features/AppDataHydrator";
import { ChildrenProps } from "@/types/types.type";

const AppShell = ({ children }: Readonly<ChildrenProps>) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const isMobileViewport = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    if (isMobileViewport) {
      setIsMobileSidebarOpen(true);
      return;
    }

    setIsSidebarCollapsed((value) => !value);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      <AppDataHydrator />

      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      <main className="appMain">
        <div className="desktopSideNav">
          <SideBar isCollapsed={isSidebarCollapsed} />
        </div>

        {isMobileSidebarOpen && (
          <div className="mobileSideNavOverlay" role="dialog" aria-modal="true" aria-label="\u041c\u0435\u043d\u044e \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u0438">
            <button className="mobileSideNavBackdrop" type="button" aria-label="\u0417\u0430\u043a\u0440\u044b\u0442\u044c \u043c\u0435\u043d\u044e" onClick={closeMobileSidebar} />
            <div className="mobileSideNavPanel">
              <SideBar isCollapsed={false} onNavigate={closeMobileSidebar} />
            </div>
          </div>
        )}

        <div className="appContent">
          <AddFolder />
          {children}
        </div>
      </main>
    </>
  );
};

export default AppShell;