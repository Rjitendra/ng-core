import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgLabelComponent } from './ng-label.component';

const meta: Meta<NgLabelComponent> = {
  title: 'Utils/Label',
  component: NgLabelComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgLabelComponent],
    }),
  ],
  args: {
    text: 'Workspace name',
    hint: 'Use a clear name your team will recognize.',
    required: true,
  },
  parameters: withControlDocs(NgLabelComponent),
};

export default meta;

type Story = StoryObj<NgLabelComponent>;

export const Default: Story = {};
