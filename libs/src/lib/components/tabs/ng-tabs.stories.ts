import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgTabsComponent } from './ng-tabs.component';

const meta: Meta<NgTabsComponent> = {
  title: 'Navigation/Tabs',
  component: NgTabsComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgTabsComponent>;

export const Default: Story = {};

export const ClientWorkspace: Story = {
  args: {
    eyebrow: 'Client workspace',
  },
};
