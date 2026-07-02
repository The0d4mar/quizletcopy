import type { Meta, StoryObj } from '@storybook/nextjs';

import { WordCard } from './WordCard';

const meta = {
  title: 'UI/Cards/WordCard',
  component: WordCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    original: 'apple',
    translation: 'яблоко',
    flipped: false,
  },
} satisfies Meta<typeof WordCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Front: Story = {};

export const Back: Story = {
  args: {
    flipped: true,
  },
};
