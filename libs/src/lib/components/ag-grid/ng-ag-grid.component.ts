import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  Signal,
  TemplateRef,
  Type,
  viewChild,
} from '@angular/core';
import { AgChartsEnterpriseModule } from 'ag-charts-enterprise';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllEnterpriseModule,
  ApplyColumnStateParams,
  CellDoubleClickedEvent,
  CellValueChangedEvent,
  ColDef,
  ColGroupDef,
  FilterChangedEvent,
  FilterModel,
  GridApi,
  GridOptions,
  GridReadyEvent,
  GridState,
  IntegratedChartsModule,
  ModuleRegistry,
  RowClassParams,
  RowDoubleClickedEvent,
  RowNode,
  RowSelectedEvent,
  SelectionChangedEvent,
  SortChangedEvent,
} from 'ag-grid-enterprise';
import { NgAgGridCalendarEditorComponent } from './editors/ng-ag-grid-calendar-editor.component';
import { NgAgGridCheckboxEditorComponent } from './editors/ng-ag-grid-checkbox-editor.component';
import { NgAgGridTextboxEditorComponent } from './editors/ng-ag-grid-textbox-editor.component';
import { NgAgGridActionRendererComponent } from './renderers/ng-ag-grid-action-renderer.component';
import { NgAgGridBooleanRendererComponent } from './renderers/ng-ag-grid-boolean-renderer.component';
import { NgAgGridTemplateRendererComponent } from './renderers/ng-ag-grid-template-renderer.component';

ModuleRegistry.registerModules([
  AllEnterpriseModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
]);

export type { ColDef, ColGroupDef, GridOptions } from 'ag-grid-enterprise';

export type AgGridRow = Record<string, unknown>;
export type NgAgGridEditorType = 'text' | 'checkbox' | 'calendar';
export type NgAgGridSelectionMode = 'single' | 'multiple' | 'none';
export type NgAgGridResourceValue =
  | readonly unknown[]
  | ((rows: AgGridRow[]) => readonly unknown[]);
export type NgAgGridResourceMap = Record<string, NgAgGridResourceValue>;
export type NgAgGridValidationResult = string | null | undefined;
export type NgAgGridValidationRule = (
  row: AgGridRow,
  column: NgAgGridColumn,
) => NgAgGridValidationResult;
export type NgAgGridToolbarAction =
  | 'add'
  | 'edit'
  | 'save'
  | 'cancel'
  | 'delete'
  | 'exportCsv'
  | 'exportExcel'
  | 'clearFilters'
  | 'resetColumns'
  | 'autoSize'
  | string;
export type NgAgGridToolbarButton = {
  id: NgAgGridToolbarAction;
  label: string;
  icon?: string;
  disabled?: boolean;
  visible?: boolean;
};
export type NgAgGridColumn = ColDef<AgGridRow> & {
  editorType?: NgAgGridEditorType;
  required?: boolean;
  templateKey?: string;
  resourceKey?: string;
  dropdown?: boolean;
  validation?: NgAgGridValidationRule;
};
export type NgAgGridRowUpdate = {
  row: AgGridRow;
  rowId: string;
  rowIndex: number | null;
};
export type NgAgGridRowInvalid = NgAgGridRowUpdate & {
  errors: Record<string, string>;
};

@Component({
  selector: 'ng-ag-grid',
  standalone: true,
  imports: [CommonModule, AgGridAngular],
  templateUrl: './ng-ag-grid.component.html',
  styleUrl: './ng-ag-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridComponent<T extends AgGridRow = AgGridRow> {
  readonly rowData = input<T[]>([]);
  readonly columnDefs = input<(NgAgGridColumn | ColGroupDef<AgGridRow>)[]>([]);
  readonly defaultColDef = input<ColDef<AgGridRow>>({});
  readonly gridOptions = input<GridOptions<AgGridRow>>({});
  readonly theme = input<string>('ag-theme-quartz');
  readonly height = input<string>('640px');
  readonly quickFilterText = input<string>('');
  readonly showToolbar = input<boolean>(true);
  readonly toolbarButtons = input<NgAgGridToolbarButton[]>([
    { id: 'exportCsv', label: 'CSV' },
    { id: 'exportExcel', label: 'Excel' },
    { id: 'clearFilters', label: 'Clear filters' },
    { id: 'resetColumns', label: 'Reset columns' },
    { id: 'autoSize', label: 'Auto size' },
  ]);
  readonly showHeaderCheckbox = input<boolean>(true);
  readonly showRowCheckbox = input<boolean>(true);
  readonly rowSelectionMode = input<NgAgGridSelectionMode>('multiple');
  readonly enableRowActions = input<boolean>(true);
  readonly enableRowEditing = input<boolean>(true);
  readonly rowIdKey = input<string>('employeeId');
  readonly actionColumnHeader = input<string>('Actions');
  readonly requiredFields = input<string[]>([]);
  readonly validationRules = input<Record<string, NgAgGridValidationRule>>({});
  readonly cellTemplates = input<Record<string, TemplateRef<unknown>>>({});
  readonly resources = input<NgAgGridResourceMap>({});
  readonly filterModel = input<FilterModel | null>(null);
  readonly columnState = input<ApplyColumnStateParams | null>(null);
  readonly gridState = input<GridState | null>(null);
  readonly pagination = input<boolean>(true);
  readonly paginationPageSize = input<number>(10);
  readonly customRenderers = input<Record<string, Type<unknown>>>({});
  readonly customEditors = input<Record<string, Type<unknown>>>({});
  readonly enableEnterpriseFeatures = input<boolean>(true);
  readonly autoGenerateColumns = input<boolean>(false);
  readonly rowNumbers = input<boolean>(false);
  readonly fullRowEdit = input<boolean>(true);

  readonly gridReady = output<GridReadyEvent<AgGridRow>>();
  readonly cellValueChanged = output<CellValueChangedEvent<AgGridRow>>();
  readonly selectionChanged = output<SelectionChangedEvent<T>>();
  readonly selectedRowsChange = output<T[]>();
  readonly rowSelected = output<RowSelectedEvent<AgGridRow>>();
  readonly rowChecked = output<T>();
  readonly rowDoubleClicked = output<RowDoubleClickedEvent<T>>();
  readonly cellDoubleClicked = output<CellDoubleClickedEvent<T>>();
  readonly filterChanged = output<FilterChangedEvent<AgGridRow>>();
  readonly sortChanged = output<SortChangedEvent<AgGridRow>>();
  readonly rowEditStart = output<NgAgGridRowUpdate>();
  readonly rowEditStop = output<NgAgGridRowUpdate>();
  readonly rowValidUpdate = output<NgAgGridRowUpdate>();
  readonly rowInvalid = output<NgAgGridRowInvalid>();
  readonly toolbarAction = output<NgAgGridToolbarAction>();

  readonly grid: Signal<AgGridAngular<T> | undefined> =
    viewChild(AgGridAngular);
  readonly editingRowId = signal<string | null>(null);
  readonly validationErrors = signal<Record<string, string>>({});

  private api?: GridApi<AgGridRow>;

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
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    ...this.defaultColDef(),
  }));

  private readonly sourceColumnDefs = computed<
    (NgAgGridColumn | ColGroupDef<AgGridRow>)[]
  >(() => {
    const columns = this.columnDefs();
    if (columns.length || !this.autoGenerateColumns()) {
      return columns;
    }

    const firstRow = this.rowData()[0];
    if (!firstRow) {
      return [];
    }

    return Object.keys(firstRow).map((field) => ({
      field,
      headerName: this.toTitleCase(field),
      editorType: this.inferEditorType(firstRow[field]),
      filter: this.inferFilter(firstRow[field]),
    }));
  });

  readonly resolvedColumnDefs = computed(() =>
    this.withActionColumn(
      this.sourceColumnDefs().map((column) => this.withCustomEditor(column)),
    ),
  );

  readonly resolvedGridOptions = computed<GridOptions<AgGridRow>>(() => ({
    animateRows: true,
    rowSelection: this.resolveRowSelection(),
    cellSelection: true,
    editType: this.fullRowEdit() ? 'fullRow' : undefined,
    suppressClickEdit: this.enableRowEditing(),
    stopEditingWhenCellsLoseFocus: false,
    getRowId: (params): string => this.getRowId(params.data),
    rowNumbers: this.rowNumbers(),
    enableCharts: this.enableEnterpriseFeatures(),
    enableAdvancedFilter: this.enableEnterpriseFeatures(),
    sideBar: this.enableEnterpriseFeatures(),
    columnMenu: 'new',
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
    icons: {
      sortAscending: '<span class="ng-ag-grid-icon">▲</span>',
      sortDescending: '<span class="ng-ag-grid-icon">▼</span>',
      sortUnSort: '<span class="ng-ag-grid-icon">↕</span>',
      filter: '<span class="ng-ag-grid-icon ng-ag-grid-icon--filter">◆</span>',
      menu: '<span class="ng-ag-grid-icon">⋮</span>',
      columns: '<span class="ng-ag-grid-icon">▦</span>',
      ...this.gridOptions().icons,
    },
    getRowClass: (params) => this.resolveRowClass(params),
    components: {
      ngTextCellEditor: NgAgGridTextboxEditorComponent,
      ngCheckboxCellEditor: NgAgGridCheckboxEditorComponent,
      ngCalendarCellEditor: NgAgGridCalendarEditorComponent,
      ngBooleanRenderer: NgAgGridBooleanRendererComponent,
      ngTemplateRenderer: NgAgGridTemplateRendererComponent,
      ngActionRenderer: NgAgGridActionRendererComponent,
      ...this.customRenderers(),
      ...this.customEditors(),
      ...this.gridOptions().components,
    },
    context: {
      ngAgGrid: this,
      ...(this.gridOptions().context as Record<string, unknown> | undefined),
    },
    ...this.gridOptions(),
  }));

  constructor() {
    effect(() => {
      const model = this.filterModel();
      if (this.api) {
        this.api.setFilterModel(model);
      }
    });

    effect(() => {
      const state = this.columnState();
      if (this.api && state) {
        this.api.applyColumnState(state);
      }
    });

    effect(() => {
      const state = this.gridState();
      if (this.api && state) {
        this.api.setState(state);
      }
    });
  }

  onGridReady(event: GridReadyEvent<AgGridRow>): void {
    this.api = event.api;
    if (this.filterModel()) {
      event.api.setFilterModel(this.filterModel());
    }
    if (this.columnState()) {
      event.api.applyColumnState(this.columnState()!);
    }
    if (this.gridState()) {
      event.api.setState(this.gridState()!);
    }
    this.gridReady.emit(event);
  }

  onSelectionChanged(event: SelectionChangedEvent<AgGridRow>): void {
    this.selectionChanged.emit(event);
    this.selectedRowsChange.emit(event.api.getSelectedRows());
  }

  onRowSelected(event: RowSelectedEvent<T>): void {
    this.rowSelected.emit(event);
    if (event.node.isSelected() && event.data) {
      this.rowChecked.emit(event.data);
    }
  }

  onToolbarAction(action: NgAgGridToolbarAction): void {
    this.toolbarAction.emit(action);

    switch (action) {
      case 'exportCsv':
        this.api?.exportDataAsCsv();
        break;
      case 'exportExcel':
        this.api?.exportDataAsExcel();
        break;
      case 'clearFilters':
        this.setGridFilter(null);
        break;
      case 'resetColumns':
        this.api?.resetColumnState();
        break;
      case 'autoSize':
        this.autoSizeAllColumns();
        break;
    }
  }

  startRowEdit(row: T | string): void {
    if (!this.api || !this.enableRowEditing()) {
      return;
    }

    const node =
      typeof row === 'string' ? this.api.getRowNode(row) : this.findNode(row);
    if (!node || node.rowIndex == null) {
      return;
    }

    if (this.editingRowId() && this.editingRowId() !== node.id) {
      return;
    }

    const firstEditableField = this.findFirstEditableField();
    if (!firstEditableField) {
      return;
    }

    this.editingRowId.set(node.id ?? this.getRowId(node.data));
    this.validationErrors.set({});
    this.api.startEditingCell({
      rowIndex: node.rowIndex,
      colKey: firstEditableField,
    });
    this.rowEditStart.emit({
      row: node.data ?? {},
      rowId: this.editingRowId()!,
      rowIndex: node.rowIndex,
    });
    this.api.refreshCells({ force: true });
  }

  stopRowEdit(cancel = false): void {
    if (!this.api || !this.editingRowId()) {
      return;
    }
    const rowId = this.editingRowId()!;
    const node = this.api.getRowNode(rowId);
    this.api.stopEditing(cancel);

    if (!node?.data || cancel) {
      this.finishEdit(node?.data ?? {}, rowId, node?.rowIndex ?? null);
      return;
    }

    const errors = this.validateRow(node.data);
    if (Object.keys(errors).length) {
      this.validationErrors.set(errors);
      this.rowInvalid.emit({
        row: node.data,
        rowId,
        rowIndex: node.rowIndex ?? null,
        errors,
      });
      queueMicrotask(() => this.startRowEdit(rowId));
      return;
    }

    this.rowValidUpdate.emit({
      row: node.data,
      rowId,
      rowIndex: node.rowIndex ?? null,
    });
    this.finishEdit(node.data, rowId, node.rowIndex ?? null);
  }

  cancelRowEdit(): void {
    this.stopRowEdit(true);
  }

  updateRow(rowId: string, patch: Partial<T>): void {
    const node = this.api?.getRowNode(rowId);
    if (!node?.data) {
      return;
    }
    const updated = { ...node.data, ...patch };
    node.setData(updated);
    this.api?.refreshCells({ rowNodes: [node], force: true });
  }

  updateWholeGrid(rows: T[]): void {
    this.api?.setGridOption('rowData', rows);
  }

  setGridFilter(model: FilterModel | null): void {
    this.api?.setFilterModel(model);
  }

  setColumnState(state: ApplyColumnStateParams): boolean {
    return this.api?.applyColumnState(state) ?? false;
  }

  setGridState(state: GridState): void {
    this.api?.setState(state);
  }

  updateGridOptions(options: GridOptions<AgGridRow>): void {
    this.api?.updateGridOptions(options);
  }

  getSelectedRows(): T[] {
    return this.api?.getSelectedRows() ?? [];
  }

  getCurrentState(): GridState | null {
    return this.api?.getState() ?? null;
  }

  autoSizeAllColumns(): void {
    const columns: string[] = [];
    this.api
      ?.getColumns()
      ?.forEach((column) => columns.push(column.getColId()));
    this.api?.autoSizeColumns(columns);
  }

  isRowEditing(row: T): boolean {
    return this.editingRowId() === this.getRowId(row);
  }

  hasActiveRowEdit(): boolean {
    return !!this.editingRowId();
  }

  getCellTemplate(fieldOrKey?: string): TemplateRef<unknown> | null {
    if (!fieldOrKey) {
      return null;
    }
    return this.cellTemplates()[fieldOrKey] ?? null;
  }

  private withCustomEditor(
    column: NgAgGridColumn | ColGroupDef<AgGridRow>,
  ): NgAgGridColumn | ColGroupDef<AgGridRow> {
    if ('children' in column) {
      return {
        ...column,
        children: column.children?.map((child) => this.withCustomEditor(child)),
      };
    }

    const {
      editorType,
      required,
      resourceKey,
      dropdown,
      templateKey,
      validation,
      ...agColumn
    } = column;
    const enrichedColumn: ColDef<AgGridRow> = {
      ...agColumn,
      editable: (params) => this.isCellEditable(params, agColumn),
      cellClassRules: {
        'ng-ag-grid-cell--invalid': (params) =>
          !!this.validationErrors()[params.colDef.field ?? ''],
        ...agColumn.cellClassRules,
      },
    };

    if (required) {
      enrichedColumn.headerName = `${agColumn.headerName ?? agColumn.field ?? ''} *`;
    }

    if (resourceKey || dropdown) {
      enrichedColumn.filter = enrichedColumn.filter ?? 'agSetColumnFilter';
      enrichedColumn.filterParams = {
        excelMode: 'windows',
        suppressSelectAll: false,
        values: this.resolveResourceValues(resourceKey ?? agColumn.field) ?? [],
        ...(typeof enrichedColumn.filterParams === 'object'
          ? enrichedColumn.filterParams
          : {}),
      };
    }

    if (templateKey) {
      enrichedColumn.cellRenderer = NgAgGridTemplateRendererComponent;
      enrichedColumn.cellRendererParams = {
        templateKey,
        ...(typeof enrichedColumn.cellRendererParams === 'object'
          ? enrichedColumn.cellRendererParams
          : {}),
      };
    }

    if (!editorType) {
      return enrichedColumn;
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
      ...enrichedColumn,
      ...editorMap[editorType],
    };
  }

  private withActionColumn(
    columns: (NgAgGridColumn | ColGroupDef<AgGridRow>)[],
  ): (NgAgGridColumn | ColGroupDef<AgGridRow>)[] {
    if (!this.enableRowActions() || !this.enableRowEditing()) {
      return columns;
    }

    return [
      ...columns,
      {
        colId: '__ngActions',
        headerName: this.actionColumnHeader(),
        pinned: 'right',
        width: 128,
        minWidth: 128,
        maxWidth: 148,
        sortable: false,
        filter: false,
        editable: false,
        suppressMovable: true,
        cellRenderer: NgAgGridActionRendererComponent,
      },
    ];
  }

  private resolveRowSelection(): GridOptions<AgGridRow>['rowSelection'] {
    const mode = this.rowSelectionMode();
    if (mode === 'none') {
      return undefined;
    }

    return {
      mode: mode === 'single' ? 'singleRow' : 'multiRow',
      checkbox: this.showRowCheckbox(),
      headerCheckbox: mode === 'multiple' && this.showHeaderCheckbox(),
      enableClickSelection: false,
    };
  }

  private validateRow(row: AgGridRow): Record<string, string> {
    const errors: Record<string, string> = {};
    const required = new Set(this.requiredFields());

    for (const column of this.flattenColumns(this.sourceColumnDefs())) {
      if (!column.field) {
        continue;
      }

      if (column.required || required.has(column.field)) {
        const value = row[column.field];
        if (value == null || String(value).trim() === '') {
          errors[column.field] =
            `${column.headerName ?? column.field} is required`;
        }
      }

      const validation =
        column.validation ?? this.validationRules()[column.field];
      const result = validation?.(row, column);
      if (result) {
        errors[column.field] = result;
      }
    }

    return errors;
  }

  private flattenColumns(
    columns: (NgAgGridColumn | ColGroupDef<AgGridRow>)[],
  ): NgAgGridColumn[] {
    return columns.flatMap((column) =>
      'children' in column
        ? this.flattenColumns(column.children as NgAgGridColumn[])
        : [column],
    );
  }

  private findFirstEditableField(): string | null {
    return (
      this.flattenColumns(this.sourceColumnDefs()).find(
        (column) => column.field && column.editable !== false,
      )?.field ?? null
    );
  }

  private resolveResourceValues(
    resourceKey?: string,
  ): readonly unknown[] | undefined {
    if (!resourceKey) {
      return undefined;
    }

    const resource = this.resources()[resourceKey];
    if (!resource) {
      return undefined;
    }

    return typeof resource === 'function'
      ? resource(this.rowData() as AgGridRow[])
      : resource;
  }

  private findNode(row: T): RowNode<T> | undefined {
    const rowId = this.getRowId(row);
    return this.api?.getRowNode(rowId) as RowNode<T> | undefined;
  }

  private finishEdit(
    row: AgGridRow,
    rowId: string,
    rowIndex: number | null,
  ): void {
    this.editingRowId.set(null);
    this.validationErrors.set({});
    this.rowEditStop.emit({ row, rowId, rowIndex });
    this.api?.refreshCells({ force: true });
  }

  private getRowId(row?: AgGridRow): string {
    if (!row) {
      return '';
    }
    const key = this.rowIdKey();
    return String(row[key] ?? row['id'] ?? JSON.stringify(row));
  }

  private resolveRowClass(
    params: RowClassParams<AgGridRow>,
  ): string | string[] | undefined {
    const classes: string[] = [];
    if (params.data && this.isRowEditing(params.data)) {
      classes.push('ng-ag-grid-row--editing');
    }
    const external = this.gridOptions().getRowClass?.(params);
    if (Array.isArray(external)) {
      classes.push(...external);
    } else if (typeof external === 'string') {
      classes.push(external);
    }
    return classes;
  }

  private isCellEditable(
    params: { node: RowNode<T> },
    column: NgAgGridColumn,
  ): boolean {
    if (!this.enableRowEditing()) {
      return false;
    }

    if (this.fullRowEdit()) {
      return column.editable ?? true;
    }

    if (typeof column.editable === 'boolean') {
      return column.editable;
    }

    const isEditingThisRow = this.isRowEditing(params.node.data as T);

    return isEditingThisRow;
  }

  private inferEditorType(value: unknown): NgAgGridEditorType {
    if (typeof value === 'boolean') {
      return 'checkbox';
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return 'calendar';
    }
    return 'text';
  }

  private inferFilter(value: unknown): ColDef<AgGridRow>['filter'] {
    if (typeof value === 'number') {
      return 'agNumberColumnFilter';
    }
    if (typeof value === 'boolean') {
      return 'agSetColumnFilter';
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return 'agDateColumnFilter';
    }
    return 'agTextColumnFilter';
  }

  private toTitleCase(value: string): string {
    return value
      .replace(/([A-Z])/g, ' $1')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase())
      .trim();
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
