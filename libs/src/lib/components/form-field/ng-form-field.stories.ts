import { MatInputModule } from '@angular/material/input';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgFormFieldComponent } from './ng-form-field.component';

const meta: Meta<NgFormFieldComponent> = {
  title: 'Forms/Form Field',
  component: NgFormFieldComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule, MatInputModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: 'Environment name',
    hint: 'Used in dashboards and audit logs.',
    helperText: 'Choose a stable label for the workspace.',
    required: true,
  },
};

export default meta;
type Story = StoryObj<NgFormFieldComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="width:min(560px, 100%);">
        <ng-form-field [label]="label" [hint]="hint" [helperText]="helperText" [required]="required">
          <input matInput placeholder="Production cluster" />
        </ng-form-field>
      </div>
    `,
  }),
};

export const ErrorState: Story = {
  render: () => ({
    template: `
      <div style="width:min(560px, 100%);">
        <ng-form-field
          label="Workspace slug"
          helperText="Lowercase only."
          [errorText]="['Slug is required.', 'Use only letters, numbers, and dashes.']"
          [required]="true"
        >
          <input matInput value="Production!" />
        </ng-form-field>
      </div>
    `,
  }),
};
