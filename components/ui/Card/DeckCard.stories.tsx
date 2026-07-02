import type { Meta, StoryObj } from '@storybook/nextjs';

import DeckCard from './DeckCard';

const meta = {
  title: 'UI/Cards/DeckCard',
  component: DeckCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    deck: {
      id: 'deck-english-basic',
      title: 'English basics',
      description: 'Starter words and short phrases',
      createdAt: '2026-06-01T10:00:00.000Z',
      updatedAt: '2026-06-20T12:00:00.000Z',
      createdBy: 'Student',
      public: true,
      lastRepeat: '2026-06-24T18:00:00.000Z',
      isStatsOpen: true,
    },
    cardsCount: 24,
  },
} satisfies Meta<typeof DeckCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyDeck: Story = {
  args: {
    deck: {
      id: 'deck-empty',
      title: 'New deck',
      description: 'No cards yet',
      createdAt: '2026-06-01T10:00:00.000Z',
      updatedAt: '2026-06-01T10:00:00.000Z',
      createdBy: 'Student',
      public: false,
      lastRepeat: '',
      isStatsOpen: true,
    },
    cardsCount: 0,
  },
};
