"use client";

import { useFolders } from "@/features/folders/useFolders";
import Link from "next/link";

const FolderList = () => {
  const { data: folders = [], isLoading, error } = useFolders();

  if (isLoading) {
    return <div className="px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-white/60">Загружаем папки...</div>;
  }

  if (error) {
    return <div className="px-[var(--padding-x-card)] py-[var(--padding-y-card)] text-white/60">Папки временно недоступны.</div>;
  }

  return (
    <div className="max-h-[264px] overflow-y-auto scrollArea">
      <div className="flex flex-col gap-4 px-[var(--padding-x-card)] py-[var(--padding-y-card)]">
        {folders.map((folder) => (
          <Link key={folder.id} href={`/folders/${folder.id}`} className="folderListBtn">
            {folder.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FolderList;