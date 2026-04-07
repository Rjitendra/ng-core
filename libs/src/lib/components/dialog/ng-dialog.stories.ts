import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { NgDialogService } from '../../services/dialog.service';
import { provideAppDialogs } from '../../services/material-dialog.service';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgDialogComponent } from './ng-dialog.component';

@Component({
  selector: 'storybook-dialog-demo',
  standalone: true,
  imports: [SharedControlsModule],
  template: `
    <ng-template #customBody>
      <div style="display:grid; gap:10px; color:#475467;">
        <div>Billing cycle: Annual</div>
        <div>Workspace seats: 12</div>
        <div>Renewal date: 31 December 2026</div>
      </div>
    </ng-template>

    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <ng-button type="filled" label="Open Confirm" icon="check_circle" (buttonClick)="openConfirm()"></ng-button>
      <ng-button type="outlined" label="Open Message" icon="info" (buttonClick)="openMessage()"></ng-button>
      <ng-button type="outlined" label="Open Popover" icon="notifications" (buttonClick)="openPopover()"></ng-button>
      <ng-button type="text" label="Open Sidebar" icon="menu_open" (buttonClick)="openSidebar()"></ng-button>
      <ng-button type="text" label="Open Custom" icon="workspace_premium" (buttonClick)="openCustom()"></ng-button>
    </div>
  `,
})
class StorybookDialogDemoComponent {
  private readonly dialogService = inject(NgDialogService);

  @ViewChild('customBody', { static: true })
  customBody!: TemplateRef<unknown>;

  openConfirm(): void {
    this.dialogService.confirm({
      title: 'Publish changes?',
      message: 'Your updated content is ready to go live.',
      details: ['3 sections were edited', '2 new assets will be published'],
      confirmText: 'Publish',
      cancelText: 'Review again',
      icon: 'publish',
    });
  }

  openMessage(): void {
    this.dialogService.messageDialog({
      type: 'info',
      title: 'Heads up',
      message: 'Your report is still generating in the background.',
      details: ['You can safely leave this page', 'We will notify you when it is ready'],
      confirmText: 'Understood',
      icon: 'info',
    });
  }

  openPopover(): void {
    this.dialogService.popoverDialog({
      type: 'warning',
      title: 'Session reminder',
      message: 'Your admin session will expire soon.',
      details: ['2 minutes remaining', 'Unsaved work may be lost'],
      confirmText: 'Extend session',
      icon: 'timer',
    });
  }

  openSidebar(): void {
    this.dialogService.sidebarDialog({
      type: 'confirm',
      title: 'Workspace settings',
      message: 'Review and update the key workspace preferences.',
      details: [
        'Brand color: Indigo',
        'Notifications: Enabled',
        'Auto-archive inactive boards: Off',
      ],
      confirmText: 'Save changes',
      cancelText: 'Cancel',
      icon: 'settings',
    });
  }

  openCustom(): void {
    this.dialogService.info({
      title: 'Subscription summary',
      message: 'Review the current plan details below.',
      contentTemplate: this.customBody,
      confirmText: 'Looks good',
      showCancel: false,
      icon: 'workspace_premium',
    });
  }
}

const meta: Meta<NgDialogComponent> = {
  title: 'Shared/Dialog',
  component: NgDialogComponent,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [provideAnimations(), provideAppDialogs()],
    }),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        code: `import { Component, inject } from '@angular/core';
import { AppDialogService, NgButton } from '@ng-core/shared';
import { MyDialogComponent } from './my-dialog.component';

@Component({
  standalone: true,
  imports: [NgButton],
  template: \`
    <ng-button
      type="filled"
      label="Open Confirm"
      icon="check_circle"
      (buttonClick)="openConfirm()"
    ></ng-button>
  \`,
})
export class DialogUsageExampleComponent {
  private readonly dialog = inject(AppDialogService);

  openConfirm(): void {
    this.dialog.open(MyDialogComponent, {
      data: {
        id: 1,
        name: 'Test',
      },
    });
  }
}`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<NgDialogComponent>;

export const Playground: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookDialogDemoComponent],
    },
    template: `<storybook-dialog-demo></storybook-dialog-demo>`,
  }),
  parameters: {
    docs: {
      source: {
        code: `this.dialog.confirmDialog({
  title: 'Publish changes?',
  message: 'Your updated content is ready to go live.',
});

this.dialog.messageDialog({
  title: 'Heads up',
  message: 'Your report is still generating.',
});

this.dialog.popoverDialog({
  title: 'Session reminder',
  message: 'Your session will expire soon.',
});

this.dialog.sidebarDialog({
  title: 'Workspace settings',
  message: 'Review and update your preferences.',
});`,
      },
    },
  },
};
