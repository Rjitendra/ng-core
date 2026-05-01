import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../button/ng-button.component';
import { IconComponent } from '../icon/ng-icon.component';
import { TableAction, TableColumn, TableOptions } from '../../models/mat-table';
import { TableRow } from '../../models/table-row.model';

@Component({
  selector: 'ng-mat-table',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    ButtonComponent,
    IconComponent,
  ],
  templateUrl: './ng-mat-table.component.html',
  styleUrl: './ng-mat-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgMatTableComponent implements AfterViewInit {
  readonly columns = input<TableColumn[]>([]);
  readonly data = input<TableRow[]>([]);
  readonly options = input<TableOptions>({});
  readonly headerCheckbox = input(false);
  readonly rowCheckbox = input(false);
  readonly isPaginator = input(false);
  readonly expandableRows = input(false);
  readonly expandedRowTemplate = input<TemplateRef<unknown>>();
  readonly expandKey = input<string>();
  readonly sorting = input(true);
  readonly search = model('');

  readonly rowClick = output<TableRow>();
  readonly selectionChange = output<TableRow[]>();
  readonly columnClick = output<string>();
  readonly rowSelect = output<TableRow>();
  readonly rowExpand = output<TableRow>();
  readonly rowAction = output<{ action: TableAction; row: TableRow }>();

  displayedColumns: string[] = [];
  readonly dataSource = new MatTableDataSource<TableRow>([]);
  selection = new SelectionModel<TableRow>(true, []);
  selectedColumn: string | null = null;
  selectedRow: TableRow | null = null;

  readonly expandedRow = signal<unknown | null>(null);
  readonly visibleColumnKeys = signal<string[]>([]);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  private readonly liveAnnouncer = inject(LiveAnnouncer);

  readonly visibleColumns = computed(() =>
    this.columns().filter(
      (column) =>
        !column.hidden &&
        (this.visibleColumnKeys().length === 0 ||
          this.visibleColumnKeys().includes(column.key)),
    ),
  );

  readonly summaryLabel = computed(() => {
    const total = this.data().length;
    const filtered = this.dataSource.filteredData.length;
    if (!total) {
      return 'No records';
    }
    if (filtered === total) {
      return `${total} records`;
    }
    return `${filtered} of ${total} records`;
  });

  constructor() {
    effect(() => {
      const cols = this.columns();
      const data = this.data();
      const opts = this.options();
      const headerCheckbox = this.headerCheckbox();
      const rowCheckbox = this.rowCheckbox();
      const expandable = this.expandableRows();
      const searchTerm = this.search();
      untracked(() => {
        const initialVisible = cols
          .filter((column) => !column.hidden)
          .map((column) => column.key);
        if (
          this.visibleColumnKeys().length === 0 ||
          this.visibleColumnKeys().some((key) => !cols.find((col) => col.key === key))
        ) {
          this.visibleColumnKeys.set(initialVisible);
        }
        this.displayedColumns = [
          ...(headerCheckbox || rowCheckbox ? ['select'] : []),
          ...(expandable ? ['expand'] : []),
          ...this.visibleColumns().map((c) => c.key),
          ...(opts.rowActions?.length ? ['actions'] : []),
        ];
        this.selection = new SelectionModel<TableRow>(opts.multiSelect ?? true, []);
        this.dataSource.data = [...data];
        this.dataSource.filterPredicate = (row, filter) =>
          this.resolveSearchText(row, opts.searchKeys).includes(filter.trim().toLowerCase());
        this.dataSource.filter = searchTerm.trim().toLowerCase();
      });
    });
  }

  ngAfterViewInit() {
    const p = this.paginator();
    const s = this.sort();
    if (p) {
      this.dataSource.paginator = p;
    }
    if (s) {
      this.dataSource.sort = s;
    }
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.selectionChange.emit(this.selection.selected);
  }

  toggleRow(row: TableRow) {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  onRowClick(row: TableRow) {
    this.rowClick.emit(row);
  }

  onColumnClick(columnKey: string) {
    this.selectedColumn = this.selectedColumn === columnKey ? null : columnKey;
    this.columnClick.emit(columnKey);
  }

  onRowSelect(row: TableRow) {
    this.selectedRow = this.selectedRow === row ? null : row;
    this.rowSelect.emit(row);
  }

  onCellClick(event: Event, row: TableRow) {
    const target = event.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('ng-icon')) {
      event.stopPropagation();
      return;
    }
    this.rowClick.emit(row);
  }

  checkboxLabel(row?: TableRow): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  toggleRowExpansion(row: TableRow, expandKey?: string): void {
    const key = expandKey ? row[expandKey] : row;
    const wasExpanded = this.expandedRow() === key;

    if (wasExpanded) {
      this.expandedRow.set(null);
    } else {
      this.expandedRow.set(key);
    }

    this.rowExpand.emit(row);
  }

  isRowExpanded(row: TableRow, expandKey?: string): boolean {
    const key = expandKey ? row[expandKey] : row;
    return this.expandedRow() === key;
  }

  isExpanded(element: TableRow) {
    const key = this.expandKey() ? element[this.expandKey()!] : element;
    return this.expandedRow() === key;
  }

  toggle(element: TableRow) {
    const key = this.expandKey() ? element[this.expandKey()!] : element;
    this.expandedRow.set(this.isExpanded(element) ? null : key);
  }

  clearSearch() {
    this.search.set('');
  }

  toggleColumnVisibility(columnKey: string) {
    this.visibleColumnKeys.update((keys) =>
      keys.includes(columnKey)
        ? keys.filter((key) => key !== columnKey)
        : [...keys, columnKey],
    );
    this.displayedColumns = [
      ...(this.headerCheckbox() || this.rowCheckbox() ? ['select'] : []),
      ...(this.expandableRows() ? ['expand'] : []),
      ...this.visibleColumns().map((c) => c.key),
      ...(this.options().rowActions?.length ? ['actions'] : []),
    ];
  }

  onRowAction(action: TableAction, row: TableRow) {
    this.rowAction.emit({ action, row });
  }

  private resolveSearchText(row: TableRow, searchKeys?: string[]) {
    const keys = searchKeys?.length ? searchKeys : Object.keys(row);
    return keys
      .map((key) => {
        const value = row[key];
        return value == null ? '' : String(value);
      })
      .join(' ')
      .toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }
}
