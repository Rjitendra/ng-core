import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { IconComponent, IconSize, IconTone } from './ng-icon.component';
import {
  CUSTOM_ICON_OPTIONS,
  MATERIAL_ICON_OPTIONS,
} from './ng-icon.registry';

const meta: Meta<IconComponent> = {
  title: 'Shared/Icon',
  component: IconComponent,
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
    name: {
      control: 'select',
      options: ['', ...MATERIAL_ICON_OPTIONS],
    },
    customIcon: {
      control: 'select',
      options: ['', ...CUSTOM_ICON_OPTIONS],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'] satisfies IconSize[],
    },
    tone: {
      control: 'select',
      options: [
        'inherit',
        'primary',
        'muted',
        'success',
        'danger',
        'warning',
        'light',
      ] satisfies IconTone[],
    },
  },
  args: {
    name: 'home',
    customIcon: undefined,
    size: 'md',
    tone: 'primary',
  },
};

export default meta;

type Story = StoryObj<IconComponent>;

export const Default: Story = {};

export const Spinning: Story = {
  args: {
    name: 'sync',
    spin: true,
  },
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:20px; align-items:flex-end;">
        <ng-icon name="bolt" size="xs"></ng-icon>
        <ng-icon name="bolt" size="sm"></ng-icon>
        <ng-icon name="bolt" size="md"></ng-icon>
        <ng-icon name="bolt" size="lg"></ng-icon>
        <ng-icon name="bolt" size="xl"></ng-icon>
      </div>
    `,
  }),
};

export const Tones: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:20px; align-items:center; font-size:28px;">
        <ng-icon name="check_circle" tone="success"></ng-icon>
        <ng-icon name="info" tone="primary"></ng-icon>
        <ng-icon name="warning" tone="warning"></ng-icon>
        <ng-icon name="error" tone="danger"></ng-icon>
        <ng-icon name="schedule" tone="muted"></ng-icon>
      </div>
    `,
  }),
};

export const CustomProjectedIcon: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:20px; align-items:center;">
        <ng-icon size="lg" tone="primary" ariaLabel="Custom sparkle icon">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z"/>
          </svg>
        </ng-icon>
        <ng-icon size="lg" tone="danger" ariaLabel="Custom diamond icon">
          <span
            style="
              width:100%;
              height:100%;
              background:currentColor;
              clip-path:polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
            "
          ></span>
        </ng-icon>
      </div>
    `,
  }),
};

export const CustomRegistryIcons: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
        <ng-icon customIcon="sparkle" size="lg" tone="primary"></ng-icon>
        <ng-icon customIcon="diamond" size="lg" tone="danger"></ng-icon>
        <ng-icon customIcon="upload_badge" size="lg" tone="success"></ng-icon>
        <ng-icon customIcon="alert_triangle" size="lg" tone="warning"></ng-icon>
        <ng-icon customIcon="status_dot" size="lg" tone="muted"></ng-icon>
      </div>
    `,
  }),
};

export const ParentUsageExample: Story = {
  render: () => ({
    template: `
      <div
        style="
          display:grid;
          gap:18px;
          padding:24px;
          width:min(520px, 100%);
          border-radius:24px;
          background:linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        "
      >
        <div style="display:flex; align-items:center; gap:12px; color:#344054;">
          <ng-icon name="inventory_2" tone="primary" size="lg"></ng-icon>
          <strong>Material icon from parent</strong>
        </div>
        <div style="display:flex; align-items:center; gap:12px; color:#344054;">
          <ng-icon tone="success" size="lg" ariaLabel="Custom upload badge">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3l5 5h-3v6h-4V8H7l5-5zm-7 13h14v5H5v-5z" />
            </svg>
          </ng-icon>
          <strong>Custom projected icon from parent</strong>
        </div>
        <div style="display:flex; align-items:center; gap:12px; color:#344054;">
          <ng-button type="filled" label="Refresh data" icon="sync"></ng-button>
          <ng-button type="outlined" label="Custom badge">
            <ng-icon size="sm" tone="warning">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </ng-icon>
          </ng-button>
        </div>
      </div>
    `,
  }),
};
