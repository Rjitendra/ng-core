import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { AlertService } from '../../services/alert.service';
import { SharedControlsModule } from '../../shared-controls.module';
import { AlertComponent } from './ng-alert.component';

@Component({
  selector: 'storybook-alert-demo',
  standalone: true,
  imports: [CommonModule, SharedControlsModule],
  template: `
    <div
      style="
        display:grid;
        gap:14px;
        width:min(920px, 100%);
        margin:0 auto;
        padding:16px;
      "
    >
      <div
        style="
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          align-items:center;
        "
      >
        <ng-button
          type="filled"
          label="Show Success"
          icon="check_circle"
          (buttonClick)="showSuccess()"
        ></ng-button>
        <ng-button
          type="outlined"
          label="Show Warning"
          icon="warning"
          (buttonClick)="showWarning()"
        ></ng-button>
        <ng-button
          type="text"
          label="Show Error"
          icon="error"
          (buttonClick)="showError()"
        ></ng-button>
        <ng-button
          type="text"
          label="Clear"
          icon="close"
          (buttonClick)="clear()"
        ></ng-button>
      </div>

      <ng-alert></ng-alert>
    </div>
  `,
})
class StorybookAlertDemoComponent implements OnInit {
  private readonly alertService = inject(AlertService);

  ngOnInit(): void {
    this.seedAlerts();
  }

  showSuccess(): void {
    this.alertService.success({
      timeout: 3500,
      errors: [
        {
          message: 'Workspace connected successfully.\nEverything is ready to go.',
          hideCloseButton: false,
        },
      ],
    });
  }

  showWarning(): void {
    this.alertService.warning({
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
  }

  showError(): void {
    this.alertService.error({
      errors: [
        {
          message: 'We could not finish checkout.\nVerify your payment details.\nTry again once the card details are updated.',
          buttons: [
            {
              label: 'Retry',
              isButton: true,
              iconType: 'refresh',
              buttonType: 'danger',
              click: () => undefined,
            },
            {
              label: 'Dismiss',
              buttonType: 'link',
              click: () => undefined,
            },
          ],
        },
      ],
    });
  }

  clear(): void {
    this.alertService.clearAlert();
  }

  private seedAlerts(): void {
    this.alertService.clearAlert();
    this.showError();
    this.showWarning();
    this.showSuccess();
  }
}

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
  render: () => ({
    moduleMetadata: {
      imports: [StorybookAlertDemoComponent],
    },
    template: `<storybook-alert-demo></storybook-alert-demo>`,
  }),
};
