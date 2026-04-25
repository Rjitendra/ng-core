import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import {
  SpinnerColor,
  SpinnerComponent,
  SpinnerMode,
  SpinnerSize,
  SpinnerVariant,
} from './ng-spinner.component';

const meta: Meta<SpinnerComponent> = {
  title: 'Feedback/Spinner',
  component: SpinnerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['circular', 'dots', 'pulse'] satisfies SpinnerVariant[],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies SpinnerSize[],
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'neutral',
        'light',
        'success',
        'danger',
      ] satisfies SpinnerColor[],
    },
    mode: {
      control: 'inline-radio',
      options: ['indeterminate', 'determinate'] satisfies SpinnerMode[],
    },
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
    },
  },
  args: {
    variant: 'circular',
    size: 'md',
    color: 'primary',
    mode: 'indeterminate',
    progress: 65,
    label: 'Loading content',
    inline: false,
  },
};

export default meta;

type Story = StoryObj<SpinnerComponent>;

export const Default: Story = {};

export const Determinate: Story = {
  args: {
    mode: 'determinate',
    progress: 72,
    label: 'Uploading assets',
  },
};

export const Dots: Story = {
  args: {
    variant: 'dots',
    label: 'Syncing records',
  },
};

export const Pulse: Story = {
  args: {
    variant: 'pulse',
    color: 'success',
    label: 'Preparing workspace',
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:24px; align-items:flex-end; flex-wrap:wrap;">
        <ng-spinner size="xs" label="Extra small"></ng-spinner>
        <ng-spinner size="sm" label="Small"></ng-spinner>
        <ng-spinner size="md" label="Medium"></ng-spinner>
        <ng-spinner size="lg" label="Large"></ng-spinner>
        <ng-spinner size="xl" label="Extra large"></ng-spinner>
      </div>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:24px; align-items:center; flex-wrap:wrap;">
        <ng-spinner variant="circular" label="Circular"></ng-spinner>
        <ng-spinner variant="dots" color="neutral" label="Dots"></ng-spinner>
        <ng-spinner variant="pulse" color="danger" label="Pulse"></ng-spinner>
      </div>
    `,
  }),
};

export const InlineUsage: Story = {
  render: () => ({
    template: `
      <div
        style="
          display:flex;
          align-items:center;
          gap:12px;
          font:600 15px/1.4 'Segoe UI', sans-serif;
          color:#344054;
        "
      >
        <ng-spinner size="sm" [inline]="true"></ng-spinner>
        Saving button state
      </div>
    `,
  }),
};

export const OverlayCard: Story = {
  render: () => ({
    template: `
      <div
        style="
          width:320px;
          padding:28px;
          border-radius:24px;
          background:linear-gradient(180deg, #eef2ff 0%, #f8fafc 100%);
        "
      >
        <ng-spinner
          variant="circular"
          size="lg"
          color="primary"
          label="Loading dashboard"
          [overlay]="true"
        ></ng-spinner>
      </div>
    `,
  }),
};
