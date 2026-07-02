import type { Meta, StoryObj } from '@storybook/nextjs';

import SideBar from './SideBar';

const meta = {
  component: SideBar,
} satisfies Meta<typeof SideBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "isCollapsed": true
  },
};