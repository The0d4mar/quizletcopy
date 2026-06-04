'use client';

import { RootState } from '@/store/store';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const FolderList = () => {
  const folders = useSelector(
    (state: RootState) => state.folders.folders
  );

  return (
    <div className="flex flex-col gap-4 px-[var(--padding-x-card)] py-[var(--padding-y-card)] ">
      {folders.map(folder => (
        <Link key={folder.id} href={`/folders/${folder.id}`} className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-[var(--padding-x-card)] py-[var(--padding-y-card)]">
          {folder.title}
        </Link>
      ))}
    </div>
  );
};

export default FolderList;