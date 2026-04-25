import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgToolbarComponent } from './ng-toolbar.component';

const meta: Meta<NgToolbarComponent> = {
  title: 'Navigation/Toolbar',
  component: NgToolbarComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgToolbarComponent>;

export const Default: Story = {};

export const EditorialDesk: Story = {
  args: {
    eyebrow: 'Editorial desk',
    title: 'Spring launch campaign',
  },
};
