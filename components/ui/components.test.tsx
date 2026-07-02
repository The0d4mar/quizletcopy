import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProgressBar from './ProgressBar/ProgressBar';
import LibraryItemCard from './LibraryItemCard/LibraryItemCard';
import { WordCard } from './Card/WordCard';
import HeaderBarBtn from '../Header/HeaderBarBtn';
import { LibraryItem } from '@/types/types.type';

describe('ProgressBar', () => {
  it('renders progress text and width', () => {
    const { container } = render(
      <ProgressBar progressPercent={40} currentIndex={1} deckCardsLength={5} />
    );

    expect(screen.getByText('Просмотрено: 2 из 5')).toBeInTheDocument();
    expect(container.querySelector('[style="width: 40%;"]')).toBeInTheDocument();
  });
});

describe('LibraryItemCard', () => {
  it('renders deck library item metadata and link', () => {
    const item: LibraryItem = {
      type: 'deck',
      id: 'deck-1',
      title: 'English words',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
      viewedAt: '2026-01-03',
      cardsCount: 7,
      href: '/deck/deck-1',
    };

    render(<LibraryItemCard item={item} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/deck/deck-1');
    expect(screen.getByText('English words')).toBeInTheDocument();
    expect(screen.getByText('7 карточек · Модуль')).toBeInTheDocument();
  });

  it('renders folder library item metadata and link', () => {
    const item: LibraryItem = {
      type: 'folder',
      id: 'folder-1',
      title: 'Languages',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-02',
      modulesCount: 3,
      href: '/folders/folder-1',
    };

    render(<LibraryItemCard item={item} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/folders/folder-1');
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('3 модулей · Папка')).toBeInTheDocument();
  });
});

describe('WordCard', () => {
  it('toggles flipped class after click', () => {
    const { container } = render(<WordCard original="cat" translation="kot" />);
    const button = screen.getByRole('button');
    const inner = container.querySelector('.flashcard-inner');

    expect(screen.getByText('cat')).toBeInTheDocument();
    expect(screen.getByText('kot')).toBeInTheDocument();
    expect(inner).not.toHaveClass('flipped');

    fireEvent.click(button);

    expect(inner).toHaveClass('flipped');
  });

  it('uses flipped prop as initial state', () => {
    const { container } = render(<WordCard original="cat" translation="kot" flipped />);

    expect(container.querySelector('.flashcard-inner')).toHaveClass('flipped');
  });
});

describe('HeaderBarBtn', () => {
  it('calls toggle handler and exposes collapsed state', () => {
    const onToggleSidebar = vi.fn();

    render(<HeaderBarBtn isSidebarCollapsed onToggleSidebar={onToggleSidebar} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(button);

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
