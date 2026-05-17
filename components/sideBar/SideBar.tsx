import React, {FC} from 'react';
import SideBarChap from './SideBarChap';
import { sideNavData } from '@/api/DataBlock';





const SideBar:FC = () => {
  const innerSideNav = sideNavData;

  return (
    <aside className=' py-6 flex flex-col gap-4 relative'>
      {Object.values(innerSideNav).map((item, index, array) => (
        <React.Fragment key={index}>
          <SideBarChap
            title={item.title}
            headers={item.headers}
            icons={item.icons}
          />

          {index !== array.length - 1 && (
            <div className='relative w-full h-0.5 bg-white rounded-2xl' />
          )}
        </React.Fragment>
      ))}
    </aside>
  );
};

export default SideBar;