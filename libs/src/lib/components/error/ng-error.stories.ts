import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgErrorComponent } from './ng-error.component';

const meta: Meta<NgErrorComponent> = {
  title: 'Feedback/Error',
  component: NgErrorComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgErrorComponent],
    }),
  ],
  parameters: withControlDocs(NgErrorComponent, {
    layout: 'padded',
  }),
  args: {
    error: 'This field is required.',
  },
};

export default meta;

type Story = StoryObj<NgErrorComponent>;

export const Default: Story = {};

export const MultipleMessages: Story = {
  args: {
    error: [
      'Project name is required.',
      'Project name must be at least 3 characters.',
    ],
  },
};
