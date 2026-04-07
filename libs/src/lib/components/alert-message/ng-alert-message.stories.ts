import type { Meta, StoryObj } from '@storybook/angular';
import { AlertMessageComponent } from './ng-alert-message.component';

const meta: Meta<AlertMessageComponent> = {
  title: 'Shared/Alert Message',
  component: AlertMessageComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    alertType: 'error',
    messageText: 'We could not save your changes.\nPlease review the highlighted fields.\nTry again after updating the missing information.',
    hideCloseButton: false,
    buttons: [
      {
        label: 'Review form',
        isButton: true,
        iconType: 'edit',
        buttonType: 'primary',
        click: () => undefined,
      },
      {
        label: 'Dismiss',
        buttonType: 'link',
        click: () => undefined,
      },
    ],
    id: 0,
  },
};

export default meta;

type Story = StoryObj<AlertMessageComponent>;

export const Default: Story = {};

export const Success: Story = {
  args: {
    alertType: 'success',
    messageText: 'Changes saved.\nYour profile is now up to date.',
    buttons: [],
  },
};
