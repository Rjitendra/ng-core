import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgFileUploadComponent } from './ng-file-upload.component';

const meta: Meta<NgFileUploadComponent> = {
  title: 'Controls/File Upload',
  component: NgFileUploadComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [SharedControlsModule, ReactiveFormsModule] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    label: 'Attachments',
    dragText: 'Drop lease PDFs here or click to browse',
    config: {
      allowMultiple: true,
      maxFiles: 5,
      maxFileSize: 5 * 1024 * 1024,
      acceptedTypes: ['application/pdf', 'image/*'],
    },
    toolTip: '',
    clarifyText: '',
    hint: 'Files stay in the browser until you upload them to your API.',
  },
};

export default meta;
type Story = StoryObj<NgFileUploadComponent>;

export const Default: Story = {};

export const Reactive: Story = {
  render: () => ({
    props: { control: new FormControl([]) },
    template: `
      <ng-file-upload
        [formControl]="control"
        label="Evidence pack"
        [config]="{ allowMultiple: true, maxFiles: 3 }"
        toolTip=""
        clarifyText=""
        hint="Bound to a FormControl of uploaded files."
      />
    `,
    moduleMetadata: { imports: [SharedControlsModule, ReactiveFormsModule] },
  }),
};
