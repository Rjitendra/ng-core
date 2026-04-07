import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ButtonComponent, ButtonVariant } from './ng-button.component';
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
    buttonType: {
      control: 'inline-radio',
      options: ['button', 'submit', 'reset'],
    },
  },
  args: {
    label: 'Save changes',
    type: 'filled',
    icon: 'save',
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
