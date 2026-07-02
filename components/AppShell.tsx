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

      <main className="flex gap-15 relative w-full px-6">
        <SideBar isCollapsed={isSidebarCollapsed} />

        <div className="flex-1 min-w-0">
          <AddFolder />
          {children}
        </div>
      </main>
    </>
  );
};

export default AppShell;