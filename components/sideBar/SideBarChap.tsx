import { SideBarChapProps } from '@/types/type';
import React, {FC} from 'react';
import AddFolderBtn from '../ui/AddFolderBtn/AddFolderBtn';
import FolderList from '../ui/FoldersList/FolderList';
import Link from 'next/link';



const SideBarChap:FC<SideBarChapProps> = ({id, title, headers, icons }) => {



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
            
            flex items-center gap-2 px-[var(--padding-x-card)] py-[var(--padding-y-card)] rounded-[var(--radius-card)]
            transition-all duration-300 ease-in-out
            hover:bg-[var(--color-hover)]
            
            ' key={index}
            href = {'/'}>
                <span>{React.createElement(icons[index])}</span>
                <span>{header}</span>
            </Link>
        ))}
        {id === 'userFolders' ? <FolderList /> : null}
        
        
    </div>
  );
};

export default SideBarChap;