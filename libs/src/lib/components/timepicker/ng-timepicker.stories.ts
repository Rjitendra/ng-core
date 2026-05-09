import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgTimepickerComponent } from './ng-timepicker.component';

const meta: Meta<NgTimepickerComponent> = {
  title: 'Forms/Timepicker',
  component: NgTimepickerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgTimepickerComponent],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgTimepickerComponent>;

export const Default: Story = {};

export const ConciergeBooking: Story = {
  args: {
    eyebrow: 'Concierge booking',
    label: 'Arrival window',
    hint: 'Offer premium appointment precision in 15-minute steps.',
  },
};
