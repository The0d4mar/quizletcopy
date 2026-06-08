import { LibraryItem } from '@/types/type';
import LibraryItemCard from '../LibraryItemCard/LibraryItemCard';

interface LibraryGroupProps {
  title: string;
  items: LibraryItem[];
}

const LibraryGroup = ({ title, items }: LibraryGroupProps) => {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-[var(--font-size-sm)] font-bold uppercase tracking-wide text-[var(--color-text-muted)]">
          {title}
        </h2>

        <div className="h-px flex-1 bg-[var(--color-border)]" />
      </div>

      <div className="flex flex-col gap-[var(--item-gap)]">
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