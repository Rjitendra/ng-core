import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { TableColumn } from '../../models/mat-table';
import { TableRow } from '../../models/table-row.model';
import { NgMatTableComponent } from './ng-mat-table.component';

const columns: TableColumn[] = [
  { key: 'name', label: 'Name', sortable: true, sticky: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

const data: TableRow[] = [
  { name: 'Avery Johnson', role: 'Admin', status: 'Active', region: 'North America', revenue: '$182k', lastTouch: '2 hours ago' },
  { name: 'Blair Chen', role: 'Analyst', status: 'Away', region: 'APAC', revenue: '$94k', lastTouch: 'Yesterday' },
  { name: 'Casey Rivera', role: 'Viewer', status: 'Active', region: 'EMEA', revenue: '$136k', lastTouch: '5 minutes ago' },
  { name: 'Dev Patel', role: 'Manager', status: 'Pending', region: 'North America', revenue: '$241k', lastTouch: '1 hour ago' },
  { name: 'Elena Garcia', role: 'Admin', status: 'Active', region: 'LATAM', revenue: '$73k', lastTouch: 'Today' },
];

const meta: Meta<NgMatTableComponent> = {
  title: 'Grid/Table',
  component: NgMatTableComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgMatTableComponent] })],
  parameters: { layout: 'padded' },
  args: {
    columns,
    data,
    sorting: true,
    rowCheckbox: false,
    headerCheckbox: false,
    isPaginator: true,
    expandableRows: false,
    options: {
      title: 'Premium data table',
      subtitle: 'Search, manage columns, sort, paginate, and trigger row-level actions from one surface.',
      pageSize: 5,
      pageSizeOptions: [5, 10],
      multiSelect: true,
      showToolbar: true,
      showSearch: true,
      showColumnManager: true,
      stickyHeader: true,
      stickyPaginator: true,
      stripedRows: true,
      searchKeys: ['name', 'role', 'status', 'region'],
      stats: [
        { label: 'Open pipeline', value: '$726k' },
        { label: 'Healthy accounts', value: '18', tone: 'success' },
      ],
      rowActions: [
        { id: 'view', label: 'View', icon: 'visibility', variant: 'icon' },
        { id: 'edit', label: 'Edit', icon: 'edit', variant: 'icon' },
      ],
    },
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

export const AdvancedWorkspaceTable: Story = {
  args: {
    columns: [
      { key: 'name', label: 'Account', sortable: true, sticky: true, minWidth: '180px' },
      { key: 'role', label: 'Owner', sortable: true, minWidth: '140px' },
      { key: 'status', label: 'Health', sortable: true, minWidth: '120px' },
      { key: 'region', label: 'Region', sortable: true, minWidth: '120px' },
      { key: 'revenue', label: 'ARR', sortable: true, headerAlign: 'right', align: 'right', minWidth: '110px' },
      { key: 'lastTouch', label: 'Last touch', sortable: true, minWidth: '120px' },
    ],
    rowCheckbox: true,
    headerCheckbox: true,
    options: {
      title: 'Client portfolio command center',
      subtitle: 'An advanced pack example with sticky columns, column manager, global search, stats, selection, and row actions.',
      pageSize: 5,
      pageSizeOptions: [5, 10, 20],
      multiSelect: true,
      showToolbar: true,
      showSearch: true,
      showColumnManager: true,
      stickyHeader: true,
      stickyPaginator: true,
      stripedRows: true,
      responsive: true,
      searchKeys: ['name', 'role', 'status', 'region', 'lastTouch'],
      stats: [
        { label: 'Expansion candidates', value: '7' },
        { label: 'At-risk accounts', value: '2', tone: 'warning' },
        { label: 'Live deals', value: '$1.4M', tone: 'success' },
      ],
      rowActions: [
        { id: 'brief', label: 'Brief', icon: 'article', variant: 'icon' },
        { id: 'message', label: 'Message', icon: 'mail', variant: 'icon' },
        { id: 'open', label: 'Open', icon: 'north_east', variant: 'icon' },
      ],
      emptyTitle: 'No accounts match this view',
      emptyDescription: 'Try clearing the search or restoring hidden columns to widen the result set.',
    },
  },
};
