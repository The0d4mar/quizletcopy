import { Search } from 'lucide-react';
import React, {FC} from 'react';


const HeaderSearch:FC = () => {
  return (
    <div className='relative'>
      <input type="text" placeholder='Поиск вопроса' className='relative z-1 pl-10 pr-6 py-2 rounded-[var(--radius-card)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)] transition-all duration-300 ease-in-out' />
      <Search className='absolute top-1/2 left-0 translate-x-1/2 -translate-y-1/2'/>
    </div>
  );
};

export default HeaderSearch;