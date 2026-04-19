import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn, TableOptions } from '../../models/mat-table';
import { TableRow } from '../../models/table-row.model';

@Component({
  selector: 'ng-mat-table',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
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

  readonly rowClick = output<TableRow>();
  readonly selectionChange = output<TableRow[]>();
  readonly columnClick = output<string>();
  readonly rowSelect = output<TableRow>();
  readonly rowExpand = output<TableRow>();

  displayedColumns: string[] = [];
  readonly dataSource = new MatTableDataSource<TableRow>([]);
  selection = new SelectionModel<TableRow>(true, []);
  selectedColumn: string | null = null;
  selectedRow: TableRow | null = null;

  readonly expandedRow = signal<unknown | null>(null);

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  private readonly liveAnnouncer = inject(LiveAnnouncer);

  constructor() {
    effect(() => {
      const cols = this.columns();
      const data = this.data();
      const opts = this.options();
      const headerCheckbox = this.headerCheckbox();
      const rowCheckbox = this.rowCheckbox();
      const expandable = this.expandableRows();
      untracked(() => {
        this.displayedColumns = [
          ...(headerCheckbox || rowCheckbox ? ['select'] : []),
          ...(expandable ? ['expand'] : []),
          ...cols.map((c) => c.key),
        ];
        this.selection = new SelectionModel<TableRow>(opts.multiSelect ?? true, []);
        this.dataSource.data = [...data];
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

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }
}
