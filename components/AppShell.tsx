"use client";

import { useState } from "react";

import Header from "@/components/Header/Header";
import SideBar from "@/components/sideBar/SideBar";
import AddFolder from "@/components/ui/AddFolder/AddFolder";
import AppDataHydrator from "@/features/AppDataHydrator";
import { ChildrenProps } from "@/types/types.type";

const AppShell = ({ children }: Readonly<ChildrenProps>) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <>
      <AppDataHydrator />

      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((value) => !value)}
      />

      <main className="appMain">
        <SideBar isCollapsed={isSidebarCollapsed} />

        <div className="appContent">
          <AddFolder />
          {children}
        </div>
      </main>
    </>
  );
};

export default AppShell;