import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgStepperComponent, StepConfig } from './ng-stepper.component';

const steps: StepConfig[] = [
  { label: 'Basics', completed: false },
  { label: 'Policies', completed: false },
  { label: 'Review', completed: false, optional: true },
];

const meta: Meta<NgStepperComponent> = {
  title: 'Shared/Stepper',
  component: NgStepperComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule] })],
  parameters: { layout: 'padded' },
  args: {
    steps,
    linear: false,
    orientation: 'horizontal',
    showNavigation: true,
  },
};

export default meta;
type Story = StoryObj<NgStepperComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ng-stepper
        [steps]="steps"
        [linear]="linear"
        [orientation]="orientation"
        [showNavigation]="showNavigation"
      >
        <p style="margin:0;">Project content for each step can be projected or provided via templates.</p>
      </ng-stepper>
    `,
  }),
};
