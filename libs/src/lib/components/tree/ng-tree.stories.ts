import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { NgTreeComponent, NgTreeNode } from './ng-tree.component';
import { SharedControlsModule } from '../../shared-controls.module';

const sampleTree: NgTreeNode[] = [
  {
    id: 'platform',
    label: 'Platform',
    description: 'Root selection can roll up the full subtree.',
    icon: 'account_tree',
    children: [
      {
        id: 'design-system',
        label: 'Design system',
        description: 'Selectable parent with nested children.',
        icon: 'palette',
        children: [
          {
            id: 'buttons',
            label: 'Buttons',
            description: 'Leaf node',
            icon: 'smart_button',
          },
          {
            id: 'forms',
            label: 'Forms',
            description: 'Leaf node',
            icon: 'fact_check',
          },
        ],
      },
      {
        id: 'delivery',
        label: 'Delivery',
        description: 'Root disabled, children still selectable.',
        icon: 'rocket_launch',
        selectable: false,
        children: [
          {
            id: 'pipelines',
            label: 'Pipelines',
            description: 'Child-only selection example.',
            icon: 'alt_route',
          },
          {
            id: 'observability',
            label: 'Observability',
            description: 'Child-only selection example.',
            icon: 'monitoring',
          },
        ],
      },
    ],
  },
];

const meta: Meta<NgTreeComponent> = {
  title: 'Shared/Tree',
  component: NgTreeComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [SharedControlsModule],
    }),
  ],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showCheckboxes: {
      control: 'boolean',
    },
    cascadeSelection: {
      control: 'boolean',
    },
    expandAll: {
      control: 'boolean',
    },
  },
  args: {
    nodes: sampleTree,
    showCheckboxes: true,
    cascadeSelection: true,
    expandAll: true,
  },
};

export default meta;

type Story = StoryObj<NgTreeComponent>;

export const Default: Story = {};

export const WithoutCheckboxes: Story = {
  args: {
    showCheckboxes: false,
  },
};

export const RootLevelSelection: Story = {
  args: {
    selectedIds: ['platform', 'design-system', 'buttons', 'forms', 'pipelines', 'observability'],
  },
};

export const ChildDrivenSelection: Story = {
  args: {
    selectedIds: ['buttons', 'forms', 'design-system', 'observability'],
  },
};

export const IndependentSelection: Story = {
  args: {
    cascadeSelection: false,
    selectedIds: ['forms', 'pipelines'],
  },
};

export const TreeShowcase: Story = {
  render: () => ({
    props: {
      nodes: sampleTree,
    },
    template: `
      <div
        style="
          width:min(760px, 100%);
          padding:24px;
          border-radius:28px;
          background:
            radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 38%),
            linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
        "
      >
        <div style="display:grid; gap:8px; margin-bottom:18px;">
          <div style="font-size:1.1rem; font-weight:700; color:#0f172a;">Advanced nested selection</div>
          <div style="font-size:0.9rem; color:#475569;">
            Parent-driven selection, child-driven rollup, child-only branches, and a plain nested tree all share the same component API.
          </div>
        </div>

        <div style="display:grid; gap:18px;">
          <ng-tree
            [nodes]="nodes"
            [selectedIds]="['buttons', 'forms', 'design-system']"
          ></ng-tree>

          <div style="height:1px; background:#e2e8f0;"></div>

          <ng-tree
            [nodes]="nodes"
            [showCheckboxes]="false"
          ></ng-tree>
        </div>
      </div>
    `,
  }),
};
