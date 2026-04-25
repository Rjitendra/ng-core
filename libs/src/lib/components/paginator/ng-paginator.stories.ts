import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgPaginatorComponent } from './ng-paginator.component';

const meta: Meta<NgPaginatorComponent> = {
  title: 'Data Display/Paginator',
  component: NgPaginatorComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
};

export default meta;
type Story = StoryObj<NgPaginatorComponent>;

export const Default: Story = {};

export const SearchResults: Story = {
  args: {
    eyebrow: 'Search results',
    title: 'Candidate shortlist',
    length: 420,
    pageSize: 20,
    pageSizeOptions: [20, 40, 80],
  },
};
