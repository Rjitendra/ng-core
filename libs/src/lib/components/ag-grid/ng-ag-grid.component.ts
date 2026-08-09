import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllEnterpriseModule,
  CellValueChangedEvent,
  ColDef,
  ColGroupDef,
  FilterChangedEvent,
  GridOptions,
  GridReadyEvent,
  ModuleRegistry,
  SelectionChangedEvent,
  SortChangedEvent,
  IntegratedChartsModule,
} from 'ag-grid-enterprise';
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise';
import { NgAgGridBooleanRendererComponent } from './renderers/ng-ag-grid-boolean-renderer.component';
import { NgAgGridCalendarEditorComponent } from './editors/ng-ag-grid-calendar-editor.component';
import { NgAgGridCheckboxEditorComponent } from './editors/ng-ag-grid-checkbox-editor.component';
import { NgAgGridTextboxEditorComponent } from './editors/ng-ag-grid-textbox-editor.component';

ModuleRegistry.registerModules([
  AllEnterpriseModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
]);

export type { ColDef, ColGroupDef, GridOptions } from 'ag-grid-enterprise';

export type AgGridRow = Record<string, unknown>;
export type NgAgGridEditorType = 'text' | 'checkbox' | 'calendar';
export type NgAgGridColumn = ColDef<AgGridRow> & {
  editorType?: NgAgGridEditorType;
};

@Component({
  selector: 'ng-ag-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './ng-ag-grid.component.html',
  styleUrl: './ng-ag-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridComponent {
  readonly rowData = input<AgGridRow[]>([]);
  readonly columnDefs = input<(NgAgGridColumn | ColGroupDef<AgGridRow>)[]>([]);
  readonly defaultColDef = input<ColDef<AgGridRow>>({});
  readonly gridOptions = input<GridOptions<AgGridRow>>({});
  readonly theme = input<string>('ag-theme-quartz');
  readonly height = input<string>('640px');
  readonly quickFilterText = input<string>('');
  readonly pagination = input<boolean>(true);
  readonly paginationPageSize = input<number>(10);
  readonly enableEnterpriseFeatures = input<boolean>(true);

  readonly gridReady = output<GridReadyEvent<AgGridRow>>();
  readonly cellValueChanged = output<CellValueChangedEvent<AgGridRow>>();
  readonly selectionChanged = output<SelectionChangedEvent<AgGridRow>>();
  readonly filterChanged = output<FilterChangedEvent<AgGridRow>>();
  readonly sortChanged = output<SortChangedEvent<AgGridRow>>();

  readonly resolvedDefaultColDef = computed<ColDef<AgGridRow>>(() => ({
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    editable: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    minWidth: 140,
    flex: 1,
    ...this.defaultColDef(),
  }));

  readonly resolvedColumnDefs = computed(() =>
    this.columnDefs().map((column) => this.withCustomEditor(column)),
  );

  readonly resolvedGridOptions = computed<GridOptions<AgGridRow>>(() => ({
    animateRows: true,
    rowSelection: {
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: false,
    },
    cellSelection: true,
    enableCharts: this.enableEnterpriseFeatures(),
    sideBar: this.enableEnterpriseFeatures(),
    statusBar: this.enableEnterpriseFeatures()
      ? {
          statusPanels: [
            { statusPanel: 'agTotalAndFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
            { statusPanel: 'agAggregationComponent' },
          ],
        }
      : undefined,
    undoRedoCellEditing: true,
    pagination: this.pagination(),
    paginationPageSize: this.paginationPageSize(),
    paginationPageSizeSelector: [10, 20, 50, 100],
    components: {
      ngTextCellEditor: NgAgGridTextboxEditorComponent,
      ngCheckboxCellEditor: NgAgGridCheckboxEditorComponent,
      ngCalendarCellEditor: NgAgGridCalendarEditorComponent,
      ngBooleanRenderer: NgAgGridBooleanRendererComponent,
      ...this.gridOptions().components,
    },
    ...this.gridOptions(),
  }));

  private withCustomEditor(
    column: NgAgGridColumn | ColGroupDef<AgGridRow>,
  ): NgAgGridColumn | ColGroupDef<AgGridRow> {
    if ('children' in column) {
      return {
        ...column,
        children: column.children?.map((child) => this.withCustomEditor(child)),
      };
    }

    const { editorType, ...agColumn } = column;
    if (!editorType) {
      return agColumn;
    }

    const editorMap: Record<NgAgGridEditorType, Partial<ColDef<AgGridRow>>> = {
      text: {
        cellEditor: NgAgGridTextboxEditorComponent,
        filter: 'agTextColumnFilter',
      },
      checkbox: {
        cellEditor: NgAgGridCheckboxEditorComponent,
        cellRenderer: NgAgGridBooleanRendererComponent,
        filter: 'agSetColumnFilter',
      },
      calendar: {
        cellEditor: NgAgGridCalendarEditorComponent,
        filter: 'agDateColumnFilter',
        valueFormatter: (params) => this.formatDateValue(params.value),
      },
    };

    return {
      ...agColumn,
      ...editorMap[editorType],
    };
  }

  private formatDateValue(value: unknown): string {
    if (!value) {
      return '';
    }
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString();
  }
}
