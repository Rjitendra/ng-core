import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgLabelComponent } from './ng-label.component';
import { SharedControlsModule } from '../../shared-controls.module';

const meta: Meta<NgLabelComponent> = {
  title: 'Shared/Label',
  component: NgLabelComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  args: {
    text: 'Workspace name',
    hint: 'Use a clear name your team will recognize.',
    required: true,
  },
};

export default meta;

type Story = StoryObj<NgLabelComponent>;

export const Default: Story = {};
