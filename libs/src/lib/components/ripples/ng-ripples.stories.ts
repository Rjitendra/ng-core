import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgRipplesComponent } from './ng-ripples.component';

const meta: Meta<NgRipplesComponent> = {
  title: 'Effects/Ripples',
  component: NgRipplesComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgRipplesComponent],
    }),
  ],
  parameters: withControlDocs(NgRipplesComponent),
};

export default meta;
type Story = StoryObj<NgRipplesComponent>;

export const Default: Story = {};

export const CenteredPulse: Story = {
  args: {
    title: 'Hero CTA ripple',
    description: 'A contained, center-origin ripple gives premium calls-to-action a more intentional feel.',
    centered: true,
    color: 'rgba(250, 204, 21, 0.28)',
    caption: 'Great for upgrade or launch surfaces.',
  },
};
