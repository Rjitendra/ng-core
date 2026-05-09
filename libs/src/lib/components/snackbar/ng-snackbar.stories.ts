import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgSnackbarComponent } from './ng-snackbar.component';

const meta: Meta<NgSnackbarComponent> = {
  title: 'Overlays/Snackbar',
  component: NgSnackbarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgSnackbarComponent],
    }),
  ],
  parameters: withControlDocs(NgSnackbarComponent),
};

export default meta;
type Story = StoryObj<NgSnackbarComponent>;

export const Default: Story = {};

export const WarningAlert: Story = {
  args: {
    title: 'Payment method expiring',
    message: 'Update your enterprise billing card to avoid service interruption next week.',
    actionLabel: 'Update now',
    variant: 'warning',
  },
};
