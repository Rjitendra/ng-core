import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgToolbarComponent } from './ng-toolbar.component';

const meta: Meta<NgToolbarComponent> = {
  title: 'Navigation/Toolbar',
  component: NgToolbarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgToolbarComponent],
    }),
  ],
  parameters: withControlDocs(NgToolbarComponent),
};

export default meta;
type Story = StoryObj<NgToolbarComponent>;

export const Default: Story = {};

export const EditorialDesk: Story = {
  args: {
    eyebrow: 'Editorial desk',
    title: 'Spring launch campaign',
  },
};
