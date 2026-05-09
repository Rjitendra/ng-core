import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgTabsComponent } from './ng-tabs.component';

const meta: Meta<NgTabsComponent> = {
  title: 'Navigation/Tabs',
  component: NgTabsComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgTabsComponent],
    }),
  ],
  parameters: withControlDocs(NgTabsComponent),
};

export default meta;
type Story = StoryObj<NgTabsComponent>;

export const Default: Story = {};

export const ClientWorkspace: Story = {
  args: {
    eyebrow: 'Client workspace',
  },
};
