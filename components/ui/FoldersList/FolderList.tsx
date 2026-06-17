'use client';

import { RootState } from '@/store/store';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const FolderList = () => {
  const [mounted, setMounted] = useState(false);

  const folders = useSelector(
    (state: RootState) => state.folders.folders
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-h-[264px] overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-4 px-[var(--padding-x-card)] py-[var(--padding-y-card)]">
        {folders.map(folder => (
          <Link
            key={folder.id}
            href={`/folders/${folder.id}`}
            className="
              block
              w-[200px]
              truncate
              rounded-[var(--radius-card)]
              border
              border-[var(--color-border)]
              px-[var(--padding-x-card)]
              py-[var(--padding-y-card)]
              shrink-0
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