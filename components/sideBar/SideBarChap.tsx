import { SideBarChapProps } from '@/types/types.type';
import React from 'react';
import AddFolderBtn from '../ui/AddFolderBtn/AddFolderBtn';
import FolderList from '../ui/FoldersList/FolderList';
import Link from 'next/link';



const SideBarChap = ({id, title, headers, icons, ways }: SideBarChapProps) => {

  const localway = ways.length === 0 ? headers.map(() => '/') : ways;




  return (
    <div className = 'flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-bold px-4 py-2.5'>{title}</h2>
          {id == 'userFolders' && (
            <AddFolderBtn />
          )}
        </div>
        {headers.map((header, index) => (
            <Link className='
            
            sideNavButton
            
            ' key={index}
            href = {localway[index]}>
                <span>{React.createElement(icons[index])}</span>
                <span>{header}</span>
            </Link>
        ))}
        {id === 'userFolders' ? <FolderList /> : null}
        
        
    </div>
  );
};

export default SideBarChap;