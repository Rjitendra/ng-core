import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgRadioOption } from '../radio/ng-radio-group.component';

const billingOptions: NgRadioOption[] = [
  { value: 'starter', label: 'Starter', description: 'For small internal tools.' },
  { value: 'growth', label: 'Growth', description: 'For production product teams.' },
  { value: 'enterprise', label: 'Enterprise', description: 'For large regulated orgs.' },
];

@Component({
  selector: 'storybook-reactive-controls',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <form [formGroup]="form" style="display:grid; gap:18px; width:min(760px, 100%);">
      <ng-textbox
        formControlName="name"
        label="Project name"
        hint="Used in dashboards and audit logs."
        helperText="Try a short, memorable team name."
        placeholder="Atlas workspace"
        prefixIcon="folder"
      ></ng-textbox>

      <ng-textbox
        formControlName="notes"
        label="Notes"
        [multiline]="true"
        helperText="You can use this for onboarding or release notes."
        placeholder="Write a helpful note..."
        suffixIcon="notes"
      ></ng-textbox>

      <ng-checkbox
        formControlName="terms"
        label="I agree to the launch checklist"
        description="This confirms the team reviewed monitoring, rollback, and access controls."
      ></ng-checkbox>

      <ng-toggle
        formControlName="notifications"
        label="Enable incident notifications"
        description="Send deployment health updates to on-call channels."
      ></ng-toggle>

      <ng-radio-group
        formControlName="plan"
        label="Choose a plan"
        hint="You can change this later."
        [options]="options"
        orientation="horizontal"
      ></ng-radio-group>

      <pre style="margin:0; padding:16px; border-radius:18px; background:#f8fafc;">{{ form.value | json }}</pre>
    </form>
  `,
})
class StorybookReactiveControlsComponent {
  readonly options = billingOptions;
  readonly form = new FormGroup({
    name: new FormControl('Atlas'),
    notes: new FormControl('Release train for Q3 launch.'),
    terms: new FormControl(true, { nonNullable: true }),
    notifications: new FormControl(false, { nonNullable: true }),
    plan: new FormControl('growth'),
  });
}

@Component({
  selector: 'storybook-template-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedControlsModule],
  template: `
    <div style="display:grid; gap:18px; width:min(760px, 100%);">
      <ng-textbox
        [(ngModel)]="name"
        name="name"
        label="Workspace owner"
        helperText="Template-driven form example."
        placeholder="Avery Johnson"
      ></ng-textbox>

      <ng-checkbox
        [(ngModel)]="agreed"
        name="agreed"
        label="Enable public signup"
        description="Visitors can request access without an invitation."
      ></ng-checkbox>

      <ng-toggle
        [(ngModel)]="sync"
        name="sync"
        label="Sync every 15 minutes"
        description="Useful for frequently changing data sources."
      ></ng-toggle>

      <ng-radio-group
        [(ngModel)]="theme"
        name="theme"
        label="Theme"
        [options]="themeOptions"
      ></ng-radio-group>

      <pre style="margin:0; padding:16px; border-radius:18px; background:#f8fafc;">{{ snapshot() | json }}</pre>
    </div>
  `,
})
class StorybookTemplateControlsComponent {
  name = 'Taylor';
  agreed = true;
  sync = false;
  theme = 'system';
  readonly themeOptions: NgRadioOption[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System default' },
  ];
  readonly snapshot = signal({});

  constructor() {
    this.snapshot.set({
      name: this.name,
      agreed: this.agreed,
      sync: this.sync,
      theme: this.theme,
    });
  }
}

const meta: Meta = {
  title: 'Shared/Form Controls',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookReactiveControlsComponent],
    },
    template: `<storybook-reactive-controls></storybook-reactive-controls>`,
  }),
};

export const TemplateDrivenForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookTemplateControlsComponent],
    },
    template: `<storybook-template-controls></storybook-template-controls>`,
  }),
};
