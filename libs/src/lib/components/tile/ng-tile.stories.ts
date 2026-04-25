import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgTileComponent } from './ng-tile.component';

const meta: Meta<NgTileComponent> = {
  title: 'Layout/Tile',
  component: NgTileComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule] })],
  parameters: { layout: 'padded' },
  args: {
    title: 'Deployment health',
    subtitle: 'Last 24 hours',
    description: 'Tracks success rate across all production releases.',
    metric: '99.96%',
    badge: 'Healthy',
    icon: 'monitoring',
    variant: 'surface',
  },
};

export default meta;
type Story = StoryObj<NgTileComponent>;
export const Default: Story = {};
export const Showcase: Story = {
  render: () => ({
    template: `
      <div style="display:grid; gap:18px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); width:min(920px, 100%);">
        <ng-tile title="API latency" subtitle="P95" metric="182ms" badge="Stable" icon="speed"></ng-tile>
        <ng-tile title="Open incidents" subtitle="Current queue" metric="3" badge="Action" icon="error" variant="outlined" [interactive]="true"></ng-tile>
        <ng-tile title="Rollback coverage" subtitle="Last 30 days" metric="100%" badge="Ready" icon="restart_alt" variant="accent"></ng-tile>
      </div>
    `,
  }),
};
