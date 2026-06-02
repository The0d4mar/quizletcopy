import { SideBarChapProps } from '@/types/type';
import React, {FC} from 'react';



const SideBarChap:FC<SideBarChapProps> = ({ title, headers, icons }) => {
  return (
    <div className = 'flex flex-col gap-2'>
        <h2 className='text-sm font-bold px-4 py-2.5'>{title}</h2>
        {headers.map((header, index) => (
            <button className='
            
            flex items-center gap-2 px-[var(--padding-x-card)] py-[var(--padding-y-card)] rounded-[var(--radius-card)]
            transition-all duration-300 ease-in-out
            hover:bg-[var(--color-hover)]
            
            ' key={index}>
                <span>{React.createElement(icons[index])}</span>
                <span>{header}</span>
            </button>
        ))}
        
    </div>
  );
};

export default SideBarChap;