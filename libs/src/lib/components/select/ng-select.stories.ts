import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgSelectComponent } from './ng-select.component';

const meta: Meta<NgSelectComponent> = {
  title: 'Controls/Select',
  component: NgSelectComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [SharedControlsModule, ReactiveFormsModule] }),
  ],
  parameters: { layout: 'padded' },
  args: {
    label: 'Priority',
    placeholder: 'Choose priority',
    options: [
      { value: 'p1', label: 'P1 — Critical' },
      { value: 'p2', label: 'P2 — High' },
      { value: 'p3', label: 'P3 — Normal' },
    ],
    required: true,
    uniqueId: 'priority-select',
    toolTip: '',
    clarifyText: '',
    hint: 'Used for routing alerts.',
    appearance: 'outline',
  },
};

export default meta;
type Story = StoryObj<NgSelectComponent>;

export const Default: Story = {};

export const Reactive: Story = {
  render: () => ({
    props: {
      control: new FormControl('p2'),
      options: [
        { value: 'p1', label: 'P1 — Critical' },
        { value: 'p2', label: 'P2 — High' },
        { value: 'p3', label: 'P3 — Normal' },
      ],
    },
    template: `
      <ng-select
        [formControl]="control"
        label="Priority"
        [options]="options"
        uniqueId="prio"
        toolTip=""
        clarifyText=""
        hint="Reactive example"
      />
    `,
    moduleMetadata: { imports: [SharedControlsModule, ReactiveFormsModule] },
  }),
};
