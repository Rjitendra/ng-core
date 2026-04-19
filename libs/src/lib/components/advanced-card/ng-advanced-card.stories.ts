import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgAdvancedCardComponent } from './ng-advanced-card.component';

const meta: Meta<NgAdvancedCardComponent> = {
  title: 'Shared/Advanced card',
  component: NgAdvancedCardComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule] })],
  parameters: { layout: 'padded' },
  args: {
    title: 'Lease summary',
    subtitle: 'Q2 portfolio review',
    headerIcon: 'description',
    appearance: 'raised',
    actions: [
      { label: 'Approve', action: 'approve', type: 'primary', icon: 'check' },
      { label: 'Request changes', action: 'changes', type: 'secondary', icon: 'edit' },
    ],
    showFooter: true,
    footerIcon: 'schedule',
    footerText: 'Autosaved while you edit',
    showTimestamp: true,
    timestamp: new Date(),
  },
};

export default meta;
type Story = StoryObj<NgAdvancedCardComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ng-advanced-card
        [title]="title"
        [subtitle]="subtitle"
        [headerIcon]="headerIcon"
        [appearance]="appearance"
        [actions]="actions"
        [showFooter]="showFooter"
        [footerIcon]="footerIcon"
        [footerText]="footerText"
        [showTimestamp]="showTimestamp"
        [timestamp]="timestamp"
      >
        <p>Main body content goes here. Use projections for rich layouts.</p>
      </ng-advanced-card>
    `,
  }),
};

export const Outlined: Story = {
  args: {
    appearance: 'outlined',
    actions: [],
    showFooter: false,
  },
};
