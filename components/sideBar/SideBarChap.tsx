import { LucideIcon } from 'lucide-react';
import React, {FC} from 'react';

interface SideBarChapProps{
    title: string,
    headers: string[],
    icons: LucideIcon[],
}


const SideBarChap:FC<SideBarChapProps> = ({ title, headers, icons }) => {
  return (
    <div className = 'flex flex-col gap-2'>
        <h2 className='text-sm font-bold px-4 py-2.5'>{title}</h2>
        {headers.map((header, index) => (
            <button className='
            
            flex items-center gap-2 px-4 py-2.5 rounded-2xl
            transition-all duration-300 ease-in-out
            hover:bg-gray-100 hover:scale-[1.02]
            
            ' key={index}>
                <span>{React.createElement(icons[index])}</span>
                <span>{header}</span>
            </button>
        ))}
        
    </div>
  );
};

export default SideBarChap;