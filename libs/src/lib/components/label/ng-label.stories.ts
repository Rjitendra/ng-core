import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgLabelComponent } from './ng-label.component';

const meta: Meta<NgLabelComponent> = {
  title: 'Utils/Label',
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
