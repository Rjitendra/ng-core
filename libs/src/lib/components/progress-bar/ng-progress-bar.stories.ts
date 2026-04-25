import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import {
  NgProgressBarComponent,
  ProgressBarSize,
  ProgressBarVariant,
} from './ng-progress-bar.component';

const meta: Meta<NgProgressBarComponent> = {
  title: 'Feedback/Progress Bar',
  component: NgProgressBarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'neutral',
        'success',
        'warning',
        'danger',
      ] satisfies ProgressBarVariant[],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'] satisfies ProgressBarSize[],
    },
    mode: {
      control: 'select',
      options: ['determinate', 'indeterminate', 'buffer', 'query'],
    },
  },
  args: {
    label: 'Upload progress',
    caption: 'Preparing media assets for deployment.',
    value: 64,
    size: 'md',
    variant: 'primary',
    mode: 'determinate',
  },
};

export default meta;
type Story = StoryObj<NgProgressBarComponent>;

export const Default: Story = {};
export const Buffer: Story = {
  args: {
    mode: 'buffer',
    label: 'Sync queue',
    value: 48,
    bufferValue: 76,
  },
};
export const Indeterminate: Story = {
  args: {
    mode: 'indeterminate',
    label: 'Indexing records',
    showValue: false,
  },
};
export const Showcase: Story = {
  render: () => ({
    template: `
      <div style="display:grid; gap:18px; width:min(720px, 100%);">
        <ng-progress-bar label="Build" caption="Frontend bundle" value="38" variant="primary"></ng-progress-bar>
        <ng-progress-bar label="Verification" caption="Tests are currently running" value="72" variant="success"></ng-progress-bar>
        <ng-progress-bar label="Release gates" caption="Awaiting manual approval" value="44" variant="warning" mode="buffer" bufferValue="80"></ng-progress-bar>
        <ng-progress-bar label="Migration" caption="Validating legacy data" variant="neutral" mode="indeterminate" [showValue]="false"></ng-progress-bar>
      </div>
    `,
  }),
};
