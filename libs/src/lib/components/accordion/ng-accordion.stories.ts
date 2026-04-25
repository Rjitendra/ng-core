import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgAccordionComponent } from './ng-accordion.component';

const items = [
  {
    id: 'api',
    title: 'API reliability',
    description: 'Status and thresholds',
    content:
      'The public API stayed above 99.95% availability this week, with error-rate alerts remaining below the paging threshold.',
    icon: 'api',
  },
  {
    id: 'deploy',
    title: 'Deployment process',
    description: 'Rollout and rollback',
    content:
      'Production deploys are released in waves with canary analysis, automatic rollback protection, and a final approval checkpoint.',
    icon: 'rocket_launch',
    expanded: true,
  },
  {
    id: 'security',
    title: 'Security checklist',
    description: 'Restricted access',
    content:
      'Secrets rotation, audit logging, and scoped credentials are required before enabling external integrations.',
    icon: 'shield',
  },
];

const meta: Meta<NgAccordionComponent> = {
  title: 'Layout/Accordion',
  component: NgAccordionComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  args: {
    items,
    multi: false,
    hideToggle: false,
    displayMode: 'default',
  },
};

export default meta;
type Story = StoryObj<NgAccordionComponent>;

export const Default: Story = {};
export const MultiOpen: Story = {
  args: {
    multi: true,
    items: items.map((item, index) => ({ ...item, expanded: index < 2 })),
  },
};
export const FlatMode: Story = {
  args: {
    displayMode: 'flat',
  },
};
