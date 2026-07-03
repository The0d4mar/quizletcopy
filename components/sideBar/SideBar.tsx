"use client";

import { sideNavData } from "@/api/DataBlock";
import React, { useState } from "react";
import SideBarChap from "./SideBarChap";

interface SideBarProps {
  isCollapsed: boolean;
  onNavigate?: () => void;
}

const SideBar = ({ isCollapsed, onNavigate }: SideBarProps) => {
  const innerSideNav = sideNavData;
  const [isFoldersHovered, setIsFoldersHovered] = useState(false);
  const isExpanded = !isCollapsed || isFoldersHovered;

  return (
    <aside
      className={`sideBar ${isExpanded ? "sideBarExpanded" : "sideBarCollapsed"}`}
      aria-label="\u0411\u043e\u043a\u043e\u0432\u0430\u044f \u043d\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044f"
    >
      {Object.values(innerSideNav).map((item, index, array) => (
        <React.Fragment key={item.id}>
          <SideBarChap
            id={item.id}
            title={item.title}
            headers={item.headers}
            icons={item.icons}
            ways={item.ways}
            isCollapsed={!isExpanded}
            onNavigate={onNavigate}
            onMouseEnter={item.id === "userFolders" ? () => setIsFoldersHovered(true) : undefined}
            onMouseLeave={item.id === "userFolders" ? () => setIsFoldersHovered(false) : undefined}
            onFocus={item.id === "userFolders" ? () => setIsFoldersHovered(true) : undefined}
            onBlur={item.id === "userFolders" ? () => setIsFoldersHovered(false) : undefined}
          />

          {index !== array.length - 1 && (
            <div className="relative w-full h-0.5 bg-[var(--colorBorder)] rounded-2xl shrink-0" />
          )}
        </React.Fragment>
      ))}
    </aside>
  );
};

export default SideBar;