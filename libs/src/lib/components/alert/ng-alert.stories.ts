import type { Meta, StoryObj } from '@storybook/angular';
import { AlertComponent } from './ng-alert.component';
import { AlertService } from '../../services/alert.service';

const meta: Meta<AlertComponent> = {
  title: 'Shared/Alert',
  component: AlertComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<AlertComponent>;

export const DemoStack: Story = {
  play: async ({ canvasElement }) => {
    const injector = (window as unknown as { __storybookAngularInjector?: { get: <T>(token: unknown) => T } })
      .__storybookAngularInjector;

    const alertService = injector?.get<AlertService>(AlertService);
    if (!alertService) {
      return;
    }

    alertService.clearAlert();
    alertService.error({
      errors: [
        {
          message: 'We could not finish checkout.\nVerify your payment details.',
        },
      ],
    });
    alertService.warning({
      errors: [
        {
          message: 'Profile is incomplete.\nAdd a primary phone number.',
          buttons: [
            {
              label: 'Review profile',
              isButton: true,
              iconType: 'edit',
              buttonType: 'primary',
              click: () => undefined,
            },
          ],
        },
      ],
    });
    alertService.success({
      timeout: 3000,
      errors: [
        {
          message: 'Workspace connected successfully.',
          hideCloseButton: false,
        },
      ],
    });

    canvasElement.dispatchEvent(new Event('storybook-alerts-ready'));
  },
};
