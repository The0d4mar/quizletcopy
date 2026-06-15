import { render, screen } from '@testing-library/react';
import DeckCard from './DeckCard';
import { Deck } from '@/types/type';
import { describe, expect, it } from 'vitest';

describe('DeckCard', () => {
  const mockDeck: Deck = {
    id: 'deck-123',
    title: 'English words',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
    public: false,
    createdBy: 'User',
    lastRepeat: '2026-01-01',
  };

  it('отображает название колоды', () => {
    render(
      <DeckCard
        deck={mockDeck}
        cardsCount={12}
      />
    );

    expect(
      screen.getByText('English words')
    ).toBeInTheDocument();
  });

  it('отображает автора', () => {
    render(
      <DeckCard
        deck={mockDeck}
        cardsCount={12}
      />
    );

    expect(
      screen.getByText('Автор: User')
    ).toBeInTheDocument();
  });

  it('отображает количество карточек', () => {
    render(
      <DeckCard
        deck={mockDeck}
        cardsCount={12}
      />
    );

    expect(
      screen.getByText(
        'Карточек: 12'
      )
    ).toBeInTheDocument();
  });

  it('ведёт на правильную страницу', () => {
    render(
      <DeckCard
        deck={mockDeck}
        cardsCount={12}
      />
    );

    const link =
      screen.getByRole('link');

    expect(link).toHaveAttribute(
      'href',
      '/deck/deck-123'
    );
  });
});