import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgSortHeaderComponent } from './ng-sort-header.component';

const meta: Meta<NgSortHeaderComponent> = {
  title: 'Data Display/Sort Header',
  component: NgSortHeaderComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgSortHeaderComponent>;

export const Default: Story = {};

export const PortfolioRanking: Story = {
  args: {
    eyebrow: 'Portfolio ranking',
    title: 'Opportunity leaderboard',
  },
};
