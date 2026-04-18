import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgDatepickerComponent } from './ng-datepicker.component';

@Component({
  selector: 'storybook-datepicker-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <div style="display:grid; gap:16px; width:min(620px, 100%);">
      <ng-datepicker
        [formControl]="control"
        label="Release date"
        helperText="Reactive form example"
      ></ng-datepicker>
      <pre style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;">{{ control.value | json }}</pre>
    </div>
  `,
})
class StorybookDatepickerReactiveComponent {
  readonly control = new FormControl(new Date('2026-05-01'));
}

const meta: Meta<NgDatepickerComponent> = {
  title: 'Shared/Datepicker',
  component: NgDatepickerComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule, FormsModule] })],
  parameters: { layout: 'padded' },
  args: {
    label: 'Launch date',
    helperText: 'Choose the target rollout date.',
    placeholder: 'Select a date',
  },
};

export default meta;
type Story = StoryObj<NgDatepickerComponent>;
export const Default: Story = {};
export const BoundedRange: Story = {
  args: {
    min: new Date('2026-04-01'),
    max: new Date('2026-06-30'),
    helperText: 'You can schedule only within this quarter.',
  },
};
export const TouchUi: Story = {
  args: {
    touchUi: true,
    startView: 'multi-year',
  },
};
export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [StorybookDatepickerReactiveComponent] },
    template: `<storybook-datepicker-reactive></storybook-datepicker-reactive>`,
  }),
};
