import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgErrorComponent } from './ng-error.component';

const meta: Meta<NgErrorComponent> = {
  title: 'Feedback/Error',
  component: NgErrorComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
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
