import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { InputType } from '../../enums/input-type';
import { NgInputComponent } from './ng-input.component';

const meta: Meta<NgInputComponent> = {
  title: 'Controls/Input',
  component: NgInputComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [NgInputComponent, ReactiveFormsModule] }),
  ],
  parameters: withControlDocs(NgInputComponent, { layout: 'padded' }),
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
    moduleMetadata: { imports: [NgInputComponent, ReactiveFormsModule] },
  }),
};
