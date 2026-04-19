import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgToggleButtonComponent } from './ng-toggle-button.component';

const meta: Meta<NgToggleButtonComponent> = {
  title: 'Shared/Toggle button',
  component: NgToggleButtonComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule, FormsModule] })],
  parameters: { layout: 'padded' },
  args: {
    options: [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
    ],
    appearance: 'standard',
    disabled: false,
    multiple: false,
  },
};

export default meta;
type Story = StoryObj<NgToggleButtonComponent>;

export const Single: Story = {};

export const Multiple: Story = {
  args: {
    multiple: true,
    options: [
      { label: 'Email', value: 'email' },
      { label: 'SMS', value: 'sms' },
      { label: 'Push', value: 'push' },
    ],
  },
};
