import { FormControl, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgSliderComponent } from './ng-slider.component';

const meta: Meta<NgSliderComponent> = {
  title: 'Controls/Slider',
  component: NgSliderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [NgSliderComponent, ReactiveFormsModule] }),
  ],
  parameters: withControlDocs(NgSliderComponent, { layout: 'padded' }),
  args: {
    label: 'Confidence threshold',
    min: 0,
    max: 100,
    step: 5,
    discrete: true,
    showTickMarks: true,
    hint: 'Higher values reduce false positives.',
    clarifyText: '',
    displayValue: 72,
    valueUnit: '%',
  },
};

export default meta;
type Story = StoryObj<NgSliderComponent>;

export const Default: Story = {};

export const Reactive: Story = {
  render: () => ({
    props: { control: new FormControl(40) },
    template: `
      <ng-slider
        [formControl]="control"
        label="Sampling rate"
        hint="Controls how much traffic is traced."
      />
    `,
    moduleMetadata: { imports: [NgSliderComponent, ReactiveFormsModule] },
  }),
};
