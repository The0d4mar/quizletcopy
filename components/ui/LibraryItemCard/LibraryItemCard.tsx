import { LibraryItem } from '@/types/types.type';
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
        rounded-[var(--radiusCard)]
        border
        border-[var(--colorBorder)]
        bg-[var(--colorSurfaceMuted)]
        px-[var(--paddingCardX)]
        py-[var(--paddingCardY)]
        transition
        hover:border-[var(--colorBorderHover)]
      "
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radiusCard)] bg-[var(--colorSurface)]">
        {item.type === 'deck' ? (
          <IdCardLanyard size={24} />
        ) : (
          <FolderIcon size={24} />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="max-w-[520px] truncate text-[var(--fontSizeMd)] font-bold">
          {item.title}
        </h3>

        <p className="text-[var(--fontSizeSm)] font-semibold text-[var(--colorTextMuted)]">
          {item.type === 'deck'
            ? `${item.cardsCount} карточек · Модуль`
            : `${item.modulesCount} модулей · Папка`}
        </p>
      </div>
    </Link>
  );
};

export default LibraryItemCard;