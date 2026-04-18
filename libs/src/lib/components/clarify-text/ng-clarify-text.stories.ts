import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgClarifyTextComponent } from './ng-clarify-text.component';

const meta: Meta<NgClarifyTextComponent> = {
  title: 'Shared/Clarify Text',
  component: NgClarifyTextComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule] })],
  args: {
    label: 'Why this matters',
    clarifyText: 'This setting controls whether users can self-serve access requests.',
  },
};

export default meta;
type Story = StoryObj<NgClarifyTextComponent>;
export const Default: Story = {};
