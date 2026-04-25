import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgBottomSheetComponent } from './ng-bottom-sheet.component';

const meta: Meta<NgBottomSheetComponent> = {
  title: 'Overlays/Bottom Sheet',
  component: NgBottomSheetComponent,
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
type Story = StoryObj<NgBottomSheetComponent>;

export const Default: Story = {};

export const TravelConcierge: Story = {
  args: {
    eyebrow: 'Travel concierge',
    title: 'Manage your arrival experience',
    description: 'Offer airport transfer, lounge access, and room preference updates from one premium action sheet.',
    highlight: 'Recommended next step: confirm your arrival window before 6 PM.',
    ctaLabel: 'Open concierge sheet',
    actions: [
      { value: 'car', label: 'Reserve chauffeur', description: 'Private pickup with flight tracking included.', icon: 'directions_car', tone: 'primary' },
      { value: 'lounge', label: 'Add lounge access', description: 'Invite one guest and skip the main queue.', icon: 'airline_seat_recline_extra', tone: 'success' },
      { value: 'suite', label: 'Request suite prep', description: 'Choose fragrance, lighting, and minibar presets.', icon: 'hotel', tone: 'warning' },
    ],
  },
};
