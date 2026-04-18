import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import {
  NgRadioGroupComponent,
  NgRadioOption,
  NgRadioOrientation,
} from './ng-radio-group.component';

const options: NgRadioOption[] = [
  { value: 'starter', label: 'Starter', description: 'Internal tools and prototypes.' },
  { value: 'growth', label: 'Growth', description: 'Production apps for product teams.' },
  { value: 'enterprise', label: 'Enterprise', description: 'Security-heavy org deployments.' },
];

@Component({
  selector: 'storybook-radio-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <div style="width:min(720px, 100%); display:grid; gap:16px;">
      <ng-radio-group
        [formControl]="control"
        label="Plan"
        hint="Reactive form control"
        [options]="options"
        orientation="horizontal"
      ></ng-radio-group>
      <pre style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;">{{ control.value | json }}</pre>
    </div>
  `,
})
class StorybookRadioReactiveComponent {
  readonly options = options;
  readonly control = new FormControl('growth');
}

@Component({
  selector: 'storybook-radio-template',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedControlsModule],
  template: `
    <div style="width:min(720px, 100%); display:grid; gap:16px;">
      <ng-radio-group
        [(ngModel)]="value"
        name="theme"
        label="Theme"
        hint="Template-driven example"
        [options]="themeOptions"
      ></ng-radio-group>
      <pre style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;">{{ value | json }}</pre>
    </div>
  `,
})
class StorybookRadioTemplateComponent {
  value = 'system';
  readonly themeOptions: NgRadioOption[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System default' },
  ];
}

const meta: Meta<NgRadioGroupComponent> = {
  title: 'Shared/Radio Group',
  component: NgRadioGroupComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'] satisfies NgRadioOrientation[],
    },
  },
  args: {
    label: 'Choose a plan',
    hint: 'You can update this later.',
    options,
    orientation: 'vertical',
  },
};

export default meta;

type Story = StoryObj<NgRadioGroupComponent>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const DisabledOption: Story = {
  args: {
    options: [
      { value: 'starter', label: 'Starter' },
      { value: 'growth', label: 'Growth', disabled: true, description: 'Unavailable on this workspace.' },
      { value: 'enterprise', label: 'Enterprise' },
    ],
  },
};

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookRadioReactiveComponent],
    },
    template: `<storybook-radio-reactive></storybook-radio-reactive>`,
  }),
};

export const TemplateDrivenForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookRadioTemplateComponent],
    },
    template: `<storybook-radio-template></storybook-radio-template>`,
  }),
};
