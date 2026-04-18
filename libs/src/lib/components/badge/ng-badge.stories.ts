import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgBadgeComponent } from './ng-badge.component';

const meta: Meta<NgBadgeComponent> = {
  title: 'Shared/Badge',
  component: NgBadgeComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule] })],
  args: {
    text: 'Active',
    variant: 'success',
    styleType: 'soft',
    size: 'md',
    icon: 'check_circle',
  },
};

export default meta;
type Story = StoryObj<NgBadgeComponent>;
export const Default: Story = {};
export const Showcase: Story = {
  render: () => ({
    template: `
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <ng-badge text="Primary" variant="primary"></ng-badge>
        <ng-badge text="Neutral" variant="neutral"></ng-badge>
        <ng-badge text="Healthy" variant="success" icon="verified"></ng-badge>
        <ng-badge text="Warning" variant="warning" styleType="outline"></ng-badge>
        <ng-badge text="Blocked" variant="danger" styleType="filled"></ng-badge>
      </div>
    `,
  }),
};
