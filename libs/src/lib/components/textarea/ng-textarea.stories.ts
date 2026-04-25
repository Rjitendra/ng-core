import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgTextareaComponent } from './ng-textarea.component';

const meta: Meta<NgTextareaComponent> = {
  title: 'Controls/Textarea',
  component: NgTextareaComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [SharedControlsModule, ReactiveFormsModule] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    label: 'Release notes',
    placeholder: 'Summarize changes for operators…',
    hint: 'Markdown is not rendered.',
    rows: 4,
    maxLength: 280,
    showCharacterCount: true,
    uniqueId: 'notes',
    toolTip: '',
    clarifyText: '',
    ariaLabel: '',
  },
};

export default meta;
type Story = StoryObj<NgTextareaComponent>;

export const Default: Story = {};

export const Reactive: Story = {
  render: () => ({
    props: {
      control: new FormControl('Initial draft body.', { nonNullable: true }),
    },
    template: `
      <ng-textarea
        [formControl]="control"
        label="Incident timeline"
        hint="Chronological entries help postmortems."
        uniqueId="timeline"
        toolTip=""
        clarifyText=""
        ariaLabel=""
      />
    `,
    moduleMetadata: { imports: [SharedControlsModule, ReactiveFormsModule] },
  }),
};
