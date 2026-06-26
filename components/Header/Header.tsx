import React from 'react';
import HeaderBarBtn from './HeaderBarBtn';
import HeaderToMain from './HeaderToMain';
import HeaderSearch from './HeaderSearch';
import { PersonStanding } from 'lucide-react';



const Header = () => {
  return (
    <header className='px-6 py-5 flex items-center justify-between'> 
        <div className='flex items-center justify-between'>
        <HeaderBarBtn/>
        <HeaderToMain/> 
        </div>
      <HeaderSearch/>
      <div>
        <PersonStanding/>
      </div>
    </header>
  );
};

export default Header;