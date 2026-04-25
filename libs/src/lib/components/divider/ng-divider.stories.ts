import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgDividerComponent } from './ng-divider.component';

const meta: Meta<NgDividerComponent> = {
  title: 'Utils/Divider',
  component: NgDividerComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [NgDividerComponent],
    }),
  ],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<NgDividerComponent>;

export const Horizontal: Story = {
  render: () => ({
    template: `
      <div style="display:grid;gap:12px;max-width:360px;">
        <p>Section A</p>
        <ng-divider />
        <p>Section B</p>
      </div>
    `,
    moduleMetadata: { imports: [NgDividerComponent] },
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <div style="display:flex;align-items:center;gap:0;height:48px;">
        <span>Left</span>
        <ng-divider [vertical]="true" />
        <span>Right</span>
      </div>
    `,
    moduleMetadata: { imports: [NgDividerComponent] },
  }),
};
