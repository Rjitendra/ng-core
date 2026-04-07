import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import {
  ButtonComponent,
  ButtonIconPosition,
  ButtonSize,
  ButtonVariant,
} from './ng-button.component';
import { SharedControlsModule } from '../../shared-controls.module';

const meta: Meta<ButtonComponent> = {
  title: 'Shared/Button',
  component: ButtonComponent,
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
    type: {
      control: 'select',
      options: [
        'text',
        'elevated',
        'outlined',
        'filled',
        'tonal',
        'icon',
        'fab',
        'mini-fab',
        'extended',
      ] satisfies ButtonVariant[],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'] satisfies ButtonSize[],
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['start', 'end'] satisfies ButtonIconPosition[],
    },
    buttonType: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset'],
    },
    target: {
      control: 'select',
      options: ['_self', '_blank', '_parent', '_top'],
    },
  },
  args: {
    label: 'Save changes',
    type: 'filled',
    icon: 'save',
    size: 'md',
    iconPosition: 'start',
    tooltip: 'Save the form',
  },
};

export default meta;

type Story = StoryObj<ButtonComponent>;

export const Default: Story = {};

export const Text: Story = {
  args: {
    type: 'text',
    label: 'Learn more',
    icon: undefined,
  },
};

export const Elevated: Story = {
  args: {
    type: 'elevated',
    label: 'Continue',
    icon: undefined,
  },
};

export const Outlined: Story = {
  args: {
    type: 'outlined',
    label: 'Edit profile',
    icon: 'edit',
  },
};

export const Filled: Story = {
  args: {
    type: 'filled',
    label: 'Save changes',
    icon: 'save',
  },
};

export const Tonal: Story = {
  args: {
    type: 'tonal',
    label: 'Review',
    icon: undefined,
  },
};

export const Icon: Story = {
  args: {
    type: 'icon',
    label: 'Delete',
    icon: 'delete',
    tooltip: 'Delete item',
  },
};

export const Fab: Story = {
  args: {
    type: 'fab',
    label: 'Add item',
    icon: 'add',
    tooltip: 'Create a new item',
  },
};

export const MiniFab: Story = {
  args: {
    type: 'mini-fab',
    label: 'Favorite',
    icon: 'favorite',
    tooltip: 'Add to favorites',
  },
};

export const Extended: Story = {
  args: {
    type: 'extended',
    label: 'Create project',
    icon: 'add_circle',
    tooltip: 'Create a new project',
  },
};

export const Link: Story = {
  args: {
    type: 'text',
    label: 'Open docs',
    href: 'https://angular.dev',
    icon: 'open_in_new',
    tooltip: 'Open Angular documentation',
  },
};

export const Disabled: Story = {
  args: {
    type: 'filled',
    label: 'Disabled action',
    icon: 'block',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    type: 'filled',
    label: 'Saving',
    icon: 'save',
    loading: true,
  },
};

export const LargeCallToAction: Story = {
  args: {
    type: 'filled',
    label: 'Launch campaign',
    icon: 'rocket_launch',
    size: 'lg',
  },
};

export const CompactAction: Story = {
  args: {
    type: 'outlined',
    label: 'Quick edit',
    icon: 'edit',
    size: 'sm',
  },
};

export const TrailingIcon: Story = {
  args: {
    type: 'text',
    label: 'Continue to review',
    icon: 'arrow_forward',
    iconPosition: 'end',
  },
};

export const FullWidth: Story = {
  args: {
    type: 'filled',
    label: 'Complete checkout',
    icon: 'shopping_bag',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const ExternalLink: Story = {
  args: {
    type: 'text',
    label: 'Open design system',
    href: 'https://material.angular.dev',
    icon: 'open_in_new',
    iconPosition: 'end',
    target: '_blank',
    tooltip: 'Open docs in a new tab',
  },
};

export const ButtonShowcase: Story = {
  render: () => ({
    template: `
      <div
        style="
          display:grid;
          gap:20px;
          width:min(720px, 100%);
          padding:24px;
          border-radius:28px;
          background:linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
        "
      >
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <ng-button type="text" label="Back" icon="arrow_back"></ng-button>
          <ng-button type="outlined" label="Preview" icon="visibility"></ng-button>
          <ng-button type="filled" label="Publish" icon="publish"></ng-button>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
          <ng-button type="icon" label="Favorite" icon="favorite" tooltip="Favorite item"></ng-button>
          <ng-button type="mini-fab" label="Add" icon="add" tooltip="Add item"></ng-button>
          <ng-button type="extended" label="Create workspace" icon="add_circle"></ng-button>
          <ng-button type="filled" label="Syncing" icon="sync" [loading]="true"></ng-button>
        </div>
        <ng-button
          type="filled"
          label="Continue to billing"
          icon="arrow_forward"
          iconPosition="end"
          [fullWidth]="true"
          size="lg"
        ></ng-button>
      </div>
    `,
  }),
};
