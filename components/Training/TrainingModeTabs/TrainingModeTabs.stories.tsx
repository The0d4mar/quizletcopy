import type { Meta, StoryObj } from '@storybook/nextjs';

import TrainingModeTabs from './TrainingModeTabs';

const meta = {
  title: 'Training/TrainingModeTabs',
  component: TrainingModeTabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Переключатель режимов тренировки. Показывает доступные сценарии работы с колодой и вызывает onChangeMode при выборе нового режима.',
      },
    },
  },
  args: {
    currentMode: 'cards',
    onChangeMode: () => undefined,
  },
  argTypes: {
    currentMode: {
      control: 'inline-radio',
      options: ['cards', 'learn', 'test'],
      description: 'Активный режим тренировки.',
      table: {
        type: { summary: 'TrainingMode' },
        defaultValue: { summary: 'cards' },
      },
    },
    onChangeMode: {
      description: 'Callback, который вызывается при клике по вкладке режима.',
      table: {
        type: { summary: '(mode: TrainingMode) => void' },
      },
    },
  },
} satisfies Meta<typeof TrainingModeTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cards: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Базовый режим карточек: пользователь листает термины и переворачивает карточки.',
      },
    },
  },
};

export const Learn: Story = {
  args: {
    currentMode: 'learn',
  },
  parameters: {
    docs: {
      description: {
        story: 'Режим заучивания: используется для последовательного закрепления терминов.',
      },
    },
  },
};

export const Test: Story = {
  args: {
    currentMode: 'test',
  },
  parameters: {
    docs: {
      description: {
        story: 'Режим теста: пользователь отвечает на вопросы по карточкам из колоды.',
      },
    },
  },
};
