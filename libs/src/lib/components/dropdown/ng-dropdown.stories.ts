import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import {
  NgDropdownAppearance,
  NgDropdownComponent,
  NgDropdownGroup,
  NgDropdownOption,
  NgDropdownSize,
} from './ng-dropdown.component';

const planOptions: NgDropdownOption[] = [
  { value: 'starter', label: 'Starter', description: 'Internal tools' },
  { value: 'growth', label: 'Growth', description: 'Production teams' },
  { value: 'enterprise', label: 'Enterprise', description: 'Large org rollout' },
];

@Component({
  selector: 'storybook-dropdown-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <div style="width:min(680px, 100%); display:grid; gap:16px;">
      <ng-dropdown
        [formControl]="control"
        label="Assign environments"
        helperText="Reactive form example"
        [options]="options"
        [multiple]="true"
        [selectAll]="true"
        [clearable]="true"
      ></ng-dropdown>
      <pre style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;">{{ control.value | json }}</pre>
    </div>
  `,
})
class StorybookDropdownReactiveComponent {
  readonly options: NgDropdownOption[] = [
    { value: 'dev', label: 'Development' },
    { value: 'qa', label: 'QA' },
    { value: 'staging', label: 'Staging' },
    { value: 'prod', label: 'Production' },
  ];
  readonly control = new FormControl(['dev', 'qa']);
}

@Component({
  selector: 'storybook-dropdown-template',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedControlsModule],
  template: `
    <div style="width:min(680px, 100%); display:grid; gap:16px;">
      <ng-dropdown
        [(ngModel)]="value"
        name="plan"
        label="Plan"
        helperText="Template-driven example"
        [options]="options"
        [clearable]="true"
      ></ng-dropdown>
      <pre style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;">{{ value | json }}</pre>
    </div>
  `,
})
class StorybookDropdownTemplateComponent {
  readonly options = planOptions;
  value = 'growth';
}

const groupedOptions: NgDropdownGroup[] = [
  {
    label: 'Frontend',
    options: [
      { value: 'angular', label: 'Angular', description: 'Design system shell', icon: 'web' },
      { value: 'react', label: 'React', description: 'Marketing site', icon: 'code' },
    ],
  },
  {
    label: 'Backend',
    options: [
      { value: 'node', label: 'Node.js', description: 'Public API', icon: 'dns' },
      { value: 'java', label: 'Java', description: 'Core services', icon: 'memory' },
    ],
  },
];

const meta: Meta<NgDropdownComponent> = {
  title: 'Shared/Dropdown',
  component: NgDropdownComponent,
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
    appearance: {
      control: 'inline-radio',
      options: ['outline', 'fill'] satisfies NgDropdownAppearance[],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'] satisfies NgDropdownSize[],
    },
    multiple: {
      control: 'boolean',
    },
    selectAll: {
      control: 'boolean',
    },
    clearable: {
      control: 'boolean',
    },
    searchable: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Choose a plan',
    hint: 'You can change this later.',
    helperText: 'Single select by default.',
    options: planOptions,
    placeholder: 'Select a plan',
    appearance: 'outline',
    size: 'md',
  },
};

export default meta;

type Story = StoryObj<NgDropdownComponent>;

export const Default: Story = {};

export const MultiSelect: Story = {
  args: {
    label: 'Select regions',
    helperText: 'Choose one or more deployment regions.',
    multiple: true,
    clearable: true,
    options: [
      { value: 'us-east', label: 'US East' },
      { value: 'us-west', label: 'US West' },
      { value: 'eu-central', label: 'EU Central' },
      { value: 'ap-south', label: 'AP South' },
    ],
  },
};

export const MultiSelectWithSelectAll: Story = {
  args: {
    label: 'Select environments',
    helperText: 'Select all is available for multi-select mode.',
    multiple: true,
    selectAll: true,
    clearable: true,
    options: [
      { value: 'dev', label: 'Development' },
      { value: 'qa', label: 'QA' },
      { value: 'staging', label: 'Staging' },
      { value: 'prod', label: 'Production' },
    ],
  },
};

export const Searchable: Story = {
  args: {
    label: 'Search frameworks',
    searchable: true,
    options: [
      { value: 'angular', label: 'Angular', description: 'Signals and Material', keywords: ['typescript', 'spa'] },
      { value: 'react', label: 'React', description: 'Component-based UI', keywords: ['jsx', 'spa'] },
      { value: 'vue', label: 'Vue', description: 'Approachable progressive framework', keywords: ['frontend'] },
      { value: 'svelte', label: 'Svelte', description: 'Compiler-driven UI', keywords: ['frontend', 'compiler'] },
    ],
  },
};

export const GroupedOptions: Story = {
  args: {
    label: 'Select technology',
    searchable: true,
    groups: groupedOptions,
    options: [],
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Deployment target',
    errorText: ['Select at least one environment.', 'Production requires approval.'],
  },
};

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookDropdownReactiveComponent],
    },
    template: `<storybook-dropdown-reactive></storybook-dropdown-reactive>`,
  }),
};

export const TemplateDrivenForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookDropdownTemplateComponent],
    },
    template: `<storybook-dropdown-template></storybook-dropdown-template>`,
  }),
};
