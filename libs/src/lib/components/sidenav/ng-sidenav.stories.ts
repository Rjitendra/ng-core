import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgSidenavComponent } from './ng-sidenav.component';

const meta: Meta<NgSidenavComponent> = {
  title: 'Navigation/Sidenav',
  component: NgSidenavComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<NgSidenavComponent>;

export const Default: Story = {};

export const DealRoom: Story = {
  args: {
    eyebrow: 'Deal room',
    title: 'Strategic account navigation',
    contentEyebrow: 'Deal intelligence',
    contentTitle: 'Northwind expansion playbook',
    contentDescription: 'Bring pricing, stakeholders, and next-best actions into a navigation shell that feels like software, not a demo.',
  },
};
