import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgTextboxComponent, TextboxAppearance, TextboxSize } from './ng-textbox.component';

@Component({
  selector: 'storybook-textbox-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <div style="width:min(640px, 100%); display:grid; gap:16px;">
      <ng-textbox
        [formControl]="control"
        label="Workspace name"
        helperText="Reactive form control"
        prefixIcon="folder"
      ></ng-textbox>
      <pre style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;">{{ control.value | json }}</pre>
    </div>
  `,
})
class StorybookTextboxReactiveComponent {
  readonly control = new FormControl('Atlas');
}

@Component({
  selector: 'storybook-textbox-template',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedControlsModule],
  template: `
    <div style="width:min(640px, 100%); display:grid; gap:16px;">
      <ng-textbox
        [(ngModel)]="value"
        name="owner"
        label="Workspace owner"
        helperText="Template-driven example"
        suffixIcon="person"
      ></ng-textbox>
      <pre style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;">{{ value | json }}</pre>
    </div>
  `,
})
class StorybookTextboxTemplateComponent {
  value = 'Taylor';
}

const meta: Meta<NgTextboxComponent> = {
  title: 'Shared/Textbox',
  component: NgTextboxComponent,
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
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'] satisfies TextboxSize[],
    },
    appearance: {
      control: 'inline-radio',
      options: ['outline', 'fill'] satisfies TextboxAppearance[],
    },
    multiline: {
      control: 'boolean',
    },
  },
  args: {
    label: 'Project name',
    hint: 'This appears in project listings.',
    helperText: 'Use a clear, memorable name.',
    placeholder: 'Atlas workspace',
    prefixIcon: 'folder',
    size: 'md',
    appearance: 'outline',
  },
};

export default meta;

type Story = StoryObj<NgTextboxComponent>;

export const Default: Story = {};

export const Multiline: Story = {
  args: {
    label: 'Release notes',
    multiline: true,
    rows: 5,
    suffixIcon: 'notes',
    prefixIcon: undefined,
    helperText: 'Summarize what changed for your team.',
    placeholder: 'Write release notes...',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Locked field',
    placeholder: 'Read only value',
    disabled: true,
    prefixIcon: 'lock',
  },
};

export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookTextboxReactiveComponent],
    },
    template: `<storybook-textbox-reactive></storybook-textbox-reactive>`,
  }),
};

export const TemplateDrivenForms: Story = {
  render: () => ({
    moduleMetadata: {
      imports: [StorybookTextboxTemplateComponent],
    },
    template: `<storybook-textbox-template></storybook-textbox-template>`,
  }),
};
