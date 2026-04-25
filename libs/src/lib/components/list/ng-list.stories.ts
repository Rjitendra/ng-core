import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgListComponent } from './ng-list.component';

const meta: Meta<NgListComponent> = {
  title: 'Navigation/List',
  component: NgListComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<NgListComponent>;

export const Default: Story = {};

export const ClientInbox: Story = {
  args: {
    eyebrow: 'Client success',
    title: 'VIP inbox',
    supportingText: 'High-touch accounts surfaced with clearer urgency and delivery metadata.',
    items: [
      { id: 'a', title: 'Executive briefing request', subtitle: 'Board deck requested for Monday morning.', meta: '2 hrs ago', icon: 'groups', tone: 'primary', selected: true },
      { id: 'b', title: 'Renewal pricing review', subtitle: 'Finance attached updated multi-year scenarios.', meta: 'Today', icon: 'payments', tone: 'success' },
      { id: 'c', title: 'Escalation follow-up', subtitle: 'Engineering confirmed a patch window.', meta: 'Pending', icon: 'priority_high', tone: 'warning' },
    ],
  },
};
