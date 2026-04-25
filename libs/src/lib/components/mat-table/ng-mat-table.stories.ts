import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TableColumn } from '../../models/mat-table';
import { TableRow } from '../../models/table-row.model';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgMatTableComponent } from './ng-mat-table.component';

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

const data: TableRow[] = [
  { name: 'Avery Johnson', role: 'Admin', status: 'Active' },
  { name: 'Blair Chen', role: 'Analyst', status: 'Away' },
  { name: 'Casey Rivera', role: 'Viewer', status: 'Active' },
];

const meta: Meta<NgMatTableComponent> = {
  title: 'Grid/Table',
  component: NgMatTableComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [SharedControlsModule] })],
  parameters: { layout: 'padded' },
  args: {
    columns,
    data,
    sorting: true,
    rowCheckbox: false,
    headerCheckbox: false,
    isPaginator: true,
    expandableRows: false,
    options: { pageSize: 5, pageSizeOptions: [5, 10], multiSelect: true },
  },
};

export default meta;
type Story = StoryObj<NgMatTableComponent>;

export const Default: Story = {};

export const WithRowSelection: Story = {
  args: {
    rowCheckbox: true,
    headerCheckbox: true,
  },
};
