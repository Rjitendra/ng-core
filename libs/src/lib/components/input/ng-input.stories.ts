import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedControlsModule } from '../../shared-controls.module';
import { InputType } from '../../enums/input-type';
import { NgInputComponent } from './ng-input.component';

const meta: Meta<NgInputComponent> = {
  title: 'Shared/Input',
  component: NgInputComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule, ReactiveFormsModule] })],
  parameters: { layout: 'padded' },
  args: {
    label: 'Workspace slug',
    placeholder: 'e.g. atlas-prod',
    type: InputType.Text,
    hint: 'Lowercase letters, numbers, and hyphens only.',
    appearance: 'outline',
  },
};

export default meta;
type Story = StoryObj<NgInputComponent>;

export const Default: Story = {};

export const Email: Story = {
  args: {
    label: 'Billing email',
    type: InputType.Email,
    placeholder: 'finance@example.com',
  },
};

export const Reactive: Story = {
  render: () => ({
    props: { control: new FormControl('demo-value', { nonNullable: true }) },
    template: `
      <ng-input
        [formControl]="control"
        label="Display name"
        hint="Shown in audit logs."
      />
    `,
    moduleMetadata: { imports: [SharedControlsModule, ReactiveFormsModule] },
  }),
};
