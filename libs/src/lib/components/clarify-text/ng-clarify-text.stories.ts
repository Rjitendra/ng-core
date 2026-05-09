import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgClarifyTextComponent } from './ng-clarify-text.component';

const meta: Meta<NgClarifyTextComponent> = {
  title: 'Utils/Clarify Text',
  component: NgClarifyTextComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgClarifyTextComponent] })],
  args: {
    label: 'Why this matters',
    clarifyText:
      'This setting controls whether users can self-serve access requests.',
  },
  parameters: withControlDocs(NgClarifyTextComponent),
};

export default meta;
type Story = StoryObj<NgClarifyTextComponent>;
export const Default: Story = {};
