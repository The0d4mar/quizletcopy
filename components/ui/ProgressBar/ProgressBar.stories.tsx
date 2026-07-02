import type { Meta, StoryObj } from '@storybook/nextjs';

import ProgressBar from './ProgressBar';

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: {
    progressPercent: 45,
    currentIndex: 8,
    deckCardsLength: 20,
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InProgress: Story = {};

export const Complete: Story = {
  args: {
    progressPercent: 100,
    currentIndex: 19,
    deckCardsLength: 20,
  },
};
