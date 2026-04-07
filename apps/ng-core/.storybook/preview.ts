import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
    docs: {
      source: {
        type: 'dynamic',
      },
    },
  },
};

export default preview;
