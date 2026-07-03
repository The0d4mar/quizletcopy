import { SideBarChapProps } from '@/types/types.type';
import React from 'react';
import AddFolderBtn from '../ui/AddFolderBtn/AddFolderBtn';
import FolderList from '../ui/FoldersList/FolderList';
import Link from 'next/link';
import { Folder } from 'lucide-react';

interface SideBarChapExtraProps {
  isCollapsed: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onNavigate?: () => void;
}

const SideBarChap = ({
  id,
  title,
  headers,
  icons,
  ways,
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onNavigate,
}: SideBarChapProps & SideBarChapExtraProps) => {
  const localway = ways.length === 0 ? headers.map(() => '/') : ways;
  const isUserFolders = id === 'userFolders';

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {title && (!isCollapsed || isUserFolders) && (
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <h2 className={`sideBarTitle ${isCollapsed ? 'sideBarTitleCollapsed' : ''}`}>
            {isUserFolders && <Folder size={18} aria-hidden="true" />}
            {!isCollapsed && <span>{title}</span>}
          </h2>
          {isUserFolders && !isCollapsed && (
            <AddFolderBtn />
          )}
        </div>
      )}

      {headers.map((header, index) => (
        <Link
          className="sideNavButton"
          key={index}
          href={localway[index]}
          title={isCollapsed ? header : undefined}
          aria-label={isCollapsed ? header : undefined}
          onClick={onNavigate}
        >
          <span className="sideNavIcon">{React.createElement(icons[index])}</span>
          {!isCollapsed && <span className="sideNavText">{header}</span>}
        </Link>
      ))}

      {isUserFolders && !isCollapsed ? <FolderList /> : null}
    </div>
  );
};

export default SideBarChap;
