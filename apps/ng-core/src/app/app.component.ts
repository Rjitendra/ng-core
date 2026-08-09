import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AgGridRow,
  GridOptions,
  NgAgGridColumn,
  NgAgGridComponent,
} from '@jitendrabehera/ng-core-controls';

@Component({
  standalone: true,
  imports: [FormsModule, NgAgGridComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'AG Grid Dynamic Demo';
  quickFilterText = '';

  readonly columnDefs: NgAgGridColumn[] = [
    {
      field: 'employeeId',
      headerName: 'Employee ID',
      width: 140,
      pinned: 'left',
    },
    {
      field: 'name',
      headerName: 'Name',
      editorType: 'text',
      minWidth: 180,
    },
    {
      field: 'role',
      headerName: 'Role',
      editorType: 'text',
      rowGroup: false,
    },
    {
      field: 'department',
      headerName: 'Department',
      filter: 'agSetColumnFilter',
      enableRowGroup: true,
    },
    {
      field: 'location',
      headerName: 'Location',
      filter: 'agSetColumnFilter',
    },
    {
      field: 'salary',
      headerName: 'Salary',
      filter: 'agNumberColumnFilter',
      type: 'rightAligned',
      aggFunc: 'sum',
      valueFormatter: ({ value }) =>
        typeof value === 'number'
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0,
            }).format(value)
          : '',
    },
    {
      field: 'joiningDate',
      headerName: 'Joining Date',
      editorType: 'calendar',
      sort: 'asc',
    },
    {
      field: 'active',
      headerName: 'Active',
      editorType: 'checkbox',
      width: 130,
    },
    {
      field: 'performance',
      headerName: 'Performance',
      filter: 'agNumberColumnFilter',
      width: 150,
    },
  ];

  readonly rowData: AgGridRow[] = [
    {
      employeeId: 'EMP-1001',
      name: 'Anika Rao',
      role: 'Frontend Engineer',
      department: 'Product',
      location: 'Bengaluru',
      salary: 126000,
      joiningDate: '2022-02-14',
      active: true,
      performance: 94,
    },
    {
      employeeId: 'EMP-1002',
      name: 'Marcus Lee',
      role: 'QA Lead',
      department: 'Quality',
      location: 'Austin',
      salary: 118000,
      joiningDate: '2021-08-09',
      active: true,
      performance: 88,
    },
    {
      employeeId: 'EMP-1003',
      name: 'Fatima Khan',
      role: 'Data Analyst',
      department: 'Insights',
      location: 'Dubai',
      salary: 109000,
      joiningDate: '2023-01-23',
      active: false,
      performance: 81,
    },
    {
      employeeId: 'EMP-1004',
      name: 'Noah Smith',
      role: 'Backend Engineer',
      department: 'Platform',
      location: 'Seattle',
      salary: 134000,
      joiningDate: '2020-11-02',
      active: true,
      performance: 91,
    },
    {
      employeeId: 'EMP-1005',
      name: 'Priya Nair',
      role: 'Product Manager',
      department: 'Product',
      location: 'Mumbai',
      salary: 142000,
      joiningDate: '2019-06-17',
      active: true,
      performance: 96,
    },
    {
      employeeId: 'EMP-1006',
      name: 'Elena Garcia',
      role: 'UX Designer',
      department: 'Design',
      location: 'Madrid',
      salary: 112000,
      joiningDate: '2022-09-12',
      active: true,
      performance: 89,
    },
    {
      employeeId: 'EMP-1007',
      name: 'Owen Wilson',
      role: 'DevOps Engineer',
      department: 'Platform',
      location: 'London',
      salary: 131000,
      joiningDate: '2021-03-29',
      active: false,
      performance: 79,
    },
    {
      employeeId: 'EMP-1008',
      name: 'Mei Chen',
      role: 'Security Engineer',
      department: 'Security',
      location: 'Singapore',
      salary: 138000,
      joiningDate: '2020-04-20',
      active: true,
      performance: 92,
    },
    {
      employeeId: 'EMP-1009',
      name: 'Daniel Brooks',
      role: 'Support Manager',
      department: 'Customer Success',
      location: 'Chicago',
      salary: 103000,
      joiningDate: '2018-10-05',
      active: true,
      performance: 84,
    },
    {
      employeeId: 'EMP-1010',
      name: 'Sara Ahmed',
      role: 'Solutions Architect',
      department: 'Sales Engineering',
      location: 'Cairo',
      salary: 147000,
      joiningDate: '2023-05-01',
      active: true,
      performance: 90,
    },
  ];

  readonly gridOptions: GridOptions<AgGridRow> = {
    enableCellTextSelection: true,
    groupDisplayType: 'multipleColumns',
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    suppressMenuHide: false,
    defaultCsvExportParams: {
      fileName: 'employees.csv',
    },
    defaultExcelExportParams: {
      fileName: 'employees.xlsx',
    },
  };
}
