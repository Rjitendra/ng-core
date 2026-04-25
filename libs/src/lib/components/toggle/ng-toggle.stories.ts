import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgToggleComponent } from './ng-toggle.component';

@Component({
  selector: 'storybook-toggle-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <div style="width:min(620px, 100%); display:grid; gap:16px;">
      <ng-toggle
        [formControl]="control"
        label="Enable audit logging"
        description="Record administrator activity for compliance review."
      ></ng-toggle>
      <pre
        style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;"
        >{{ control.value | json }}</pre
      >
    </div>
  `,
})
class StorybookToggleReactiveComponent {
  readonly control = new FormControl(true, { nonNullable: true });
}

@Component({
  selector: 'storybook-toggle-template',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedControlsModule],
  template: `
    <div style="width:min(620px, 100%); display:grid; gap:16px;">
      <ng-toggle
        [(ngModel)]="value"
        name="sync"
        label="Sync every 15 minutes"
        description="Best for frequently changing dashboards."
      ></ng-toggle>
      <pre
        style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;"
        >{{ value | json }}</pre
      >
    </div>
  `,
})
class StorybookToggleTemplateComponent {
  value = false;
}

const meta: Meta<NgToggleComponent> = {
  title: 'Controls/Toggle',
  component: NgToggleComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Enable notifications',
    description: 'Send status updates to your team channels.',
  },
};

export default meta;

type Story = StoryObj<NgToggleComponent>;

export const Default: Story = {};

export const WithoutIcon: Story = {
  args: {
    hideIcon: true,
    label: 'Silent mode',
    description: 'Use a minimal switch without the built-in icon.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Policy controlled',
    description: 'Managed by an organization-wide setting.',
  },
};

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookToggleReactiveComponent],
    },
    template: `<storybook-toggle-reactive></storybook-toggle-reactive>`,
  }),
};

export const TemplateDrivenForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookToggleTemplateComponent],
    },
    template: `<storybook-toggle-template></storybook-toggle-template>`,
  }),
};
