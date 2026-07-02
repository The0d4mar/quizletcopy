import type { Preview } from '@storybook/nextjs';
import { Provider } from 'react-redux';

import '../app/globals.css';
import { store } from '../store/store';

const preview: Preview = {
  decorators: [
    Story => (
      <Provider store={store}>
        <div style={{ minHeight: '100vh', padding: '32px' }}>
          <Story />
        </div>
      </Provider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
