'use client';

import { RootState } from '@/store/store';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const FolderList = () => {

  const folders = useSelector(
    (state: RootState) => state.folders.folders
  );


  return (
    <div className="max-h-[264px] overflow-y-auto scrollArea">
      <div className="flex flex-col gap-4 px-[var(--padding-x-card)] py-[var(--padding-y-card)]">
        {folders.map(folder => (
          <Link
            key={folder.id}
            href={`/folders/${folder.id}`}
            className="
             folderListBtn
            "
          >
            {folder.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FolderList;