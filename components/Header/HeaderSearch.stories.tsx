import type { Meta, StoryObj } from '@storybook/nextjs';

import HeaderSearch from './HeaderSearch';

const meta = {
  component: HeaderSearch,
} satisfies Meta<typeof HeaderSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};