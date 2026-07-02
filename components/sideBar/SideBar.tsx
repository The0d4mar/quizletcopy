'use client';

import React, { useState } from 'react';
import SideBarChap from './SideBarChap';
import { sideNavData } from '@/api/DataBlock';

interface SideBarProps {
  isCollapsed: boolean;
}

const SideBar = ({ isCollapsed }: SideBarProps) => {
  const innerSideNav = sideNavData;
  const [isFoldersHovered, setIsFoldersHovered] = useState(false);
  const isExpanded = !isCollapsed || isFoldersHovered;

  return (
    <aside
      className={`sideBar ${isExpanded ? 'sideBarExpanded' : 'sideBarCollapsed'}`}
      aria-label="Боковая навигация"
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
            onMouseEnter={item.id === 'userFolders' ? () => setIsFoldersHovered(true) : undefined}
            onMouseLeave={item.id === 'userFolders' ? () => setIsFoldersHovered(false) : undefined}
            onFocus={item.id === 'userFolders' ? () => setIsFoldersHovered(true) : undefined}
            onBlur={item.id === 'userFolders' ? () => setIsFoldersHovered(false) : undefined}
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
