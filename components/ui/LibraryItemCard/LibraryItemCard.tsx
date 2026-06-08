import { LibraryItem } from '@/types/type';
import { FolderIcon, IdCardLanyard } from 'lucide-react';
import Link from 'next/link';

interface LibraryItemCardProps {
  item: LibraryItem;
}

const LibraryItemCard = ({ item }: LibraryItemCardProps) => {
  return (
    <Link
      href={item.href}
      className="
        flex
        w-full
        items-center
        gap-4
        rounded-[var(--radius-card)]
        border
        border-[var(--color-border)]
        bg-[var(--color-hover)]
        px-[var(--padding-x-card)]
        py-[var(--padding-y-card)]
        transition
        hover:border-[var(--color-border-hover)]
      "
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-card)] bg-[var(--color-surface)]">
        {item.type === 'deck' ? (
          <IdCardLanyard size={24} />
        ) : (
          <FolderIcon size={24} />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="max-w-[520px] truncate text-[var(--font-size-md)] font-bold">
          {item.title}
        </h3>

        <p className="text-[var(--font-size-sm)] font-semibold text-[var(--color-text-muted)]">
          {item.type === 'deck'
            ? `${item.cardsCount} карточек · Модуль`
            : `${item.modulesCount} модулей · Папка`}
        </p>
      </div>
    </Link>
  );
};

export default LibraryItemCard;