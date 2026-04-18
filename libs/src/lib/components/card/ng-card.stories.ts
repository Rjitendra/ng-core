import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgCardComponent } from './ng-card.component';

const meta: Meta<NgCardComponent> = {
  title: 'Shared/Card',
  component: NgCardComponent,
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
    eyebrow: 'Workspace',
    title: 'Platform analytics',
    subtitle: 'Weekly reliability snapshot',
    description: 'Monitor release health, support load, and incident trends from one place.',
    badge: 'Healthy',
    icon: 'insights',
    variant: 'elevated',
  },
};

export default meta;
type Story = StoryObj<NgCardComponent>;

export const Default: Story = {};
export const WithImage: Story = {
  args: {
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Dashboard graphs',
  },
};
export const Interactive: Story = {
  args: {
    interactive: true,
    variant: 'outlined',
  },
};
export const Showcase: Story = {
  render: () => ({
    template: `
      <div style="display:grid; gap:20px; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); width:min(980px, 100%);">
        <ng-card
          eyebrow="Release"
          title="Frontend deploy"
          subtitle="Build 18.4.2"
          description="Deployment completed with a rollback window of 30 minutes."
          badge="Live"
          icon="rocket_launch"
          variant="elevated"
        >
          <div card-actions style="display:flex; gap:10px;">
            <ng-button type="filled" label="Open report"></ng-button>
            <ng-button type="text" label="Dismiss"></ng-button>
          </div>
        </ng-card>
        <ng-card
          eyebrow="Coverage"
          title="API reliability"
          description="SLA is trending above target for the third week in a row."
          badge="99.96%"
          icon="verified"
          variant="outlined"
          [interactive]="true"
        ></ng-card>
        <ng-card
          eyebrow="Backlog"
          title="Support queue"
          description="12 customer tickets need assignment before the next standup."
          badge="12 open"
          icon="support_agent"
          variant="ghost"
        ></ng-card>
      </div>
    `,
  }),
};
