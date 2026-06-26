import { LibraryItem } from '@/types/types.type';
import LibraryItemCard from '../LibraryItemCard/LibraryItemCard';

interface LibraryGroupProps {
  title: string;
  items: LibraryItem[];
}

const LibraryGroup = ({ title, items }: LibraryGroupProps) => {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-[var(--fontSizeSm)] font-bold uppercase tracking-wide text-[var(--colorTextMuted)]">
          {title}
        </h2>

        <div className="h-px flex-1 bg-[var(--colorBorder)]" />
      </div>

      <div className="flex flex-col gap-[var(--gapMd)]">
        {items.map(item => (
          <LibraryItemCard
            key={`${item.type}-${item.id}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default LibraryGroup;