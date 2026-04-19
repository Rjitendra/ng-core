import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgAutocompleteComponent } from './ng-autocomplete.component';

const cities = [
  { value: 'nyc', label: 'New York' },
  { value: 'lon', label: 'London' },
  { value: 'tok', label: 'Tokyo' },
];

const meta: Meta<NgAutocompleteComponent> = {
  title: 'Shared/Autocomplete',
  component: NgAutocompleteComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule, ReactiveFormsModule] })],
  parameters: { layout: 'padded' },
  args: {
    label: 'City',
    placeholder: 'Start typing…',
    options: cities,
    hint: 'Choose a headquarters city.',
  },
};

export default meta;
type Story = StoryObj<NgAutocompleteComponent>;

export const Default: Story = {};

export const Reactive: Story = {
  render: () => ({
    props: { control: new FormControl(cities[0]), options: cities },
    template: `
      <ng-autocomplete
        [formControl]="control"
        label="City"
        hint="Bound with reactive forms."
        [options]="options"
      />
    `,
    moduleMetadata: { imports: [SharedControlsModule, ReactiveFormsModule] },
  }),
};
