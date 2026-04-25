import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgCheckboxComponent } from './ng-checkbox.component';

@Component({
  selector: 'storybook-checkbox-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <div style="width:min(620px, 100%); display:grid; gap:16px;">
      <ng-checkbox
        [formControl]="control"
        label="Enable release approvals"
        description="Require one approver before production deployment."
      ></ng-checkbox>
      <pre
        style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;"
        >{{ control.value | json }}</pre
      >
    </div>
  `,
})
class StorybookCheckboxReactiveComponent {
  readonly control = new FormControl(true, { nonNullable: true });
}

@Component({
  selector: 'storybook-checkbox-template',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedControlsModule],
  template: `
    <div style="width:min(620px, 100%); display:grid; gap:16px;">
      <ng-checkbox
        [(ngModel)]="value"
        name="signup"
        label="Allow self-service signup"
        description="Visitors can request access without an admin invite."
      ></ng-checkbox>
      <pre
        style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;"
        >{{ value | json }}</pre
      >
    </div>
  `,
})
class StorybookCheckboxTemplateComponent {
  value = false;
}

const meta: Meta<NgCheckboxComponent> = {
  title: 'Controls/Checkbox',
  component: NgCheckboxComponent,
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
    label: 'I agree to the deployment checklist',
    description:
      'Confirms rollback, monitoring, and access controls were reviewed.',
  },
};

export default meta;

type Story = StoryObj<NgCheckboxComponent>;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: {
    label: 'Partial selection',
    description: 'Useful when only some nested items are selected.',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled preference',
    description: 'This option is locked by policy.',
    disabled: true,
  },
};

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookCheckboxReactiveComponent],
    },
    template: `<storybook-checkbox-reactive></storybook-checkbox-reactive>`,
  }),
};

export const TemplateDrivenForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookCheckboxTemplateComponent],
    },
    template: `<storybook-checkbox-template></storybook-checkbox-template>`,
  }),
};
