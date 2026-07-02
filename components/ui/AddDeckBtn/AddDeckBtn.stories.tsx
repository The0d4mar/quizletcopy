import type { Meta, StoryObj } from '@storybook/nextjs';

import AddDeckBtn from './AddDeckBtn';

const meta = {
  component: AddDeckBtn,
} satisfies Meta<typeof AddDeckBtn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};