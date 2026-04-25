import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  viewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

export interface NgSortHeaderRow {
  name: string;
  pipeline: number;
  growth: number;
  score: number;
}

@Component({
  selector: 'ng-sort-header',
  standalone: true,
  imports: [CommonModule, MatSortModule, MatTableModule],
  template: `
    <section class="ng-sort-header">
      <div class="ng-sort-header__header">
        <div>
          <p>{{ eyebrow() }}</p>
          <h3>{{ title() }}</h3>
        </div>
        <span>Sortable premium metrics</span>
      </div>
      <table mat-table [dataSource]="dataSource" matSort class="ng-sort-header__table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Account</th>
          <td mat-cell *matCellDef="let row">{{ row.name }}</td>
        </ng-container>
        <ng-container matColumnDef="pipeline">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Pipeline</th>
          <td mat-cell *matCellDef="let row">&#36;{{ row.pipeline }}k</td>
        </ng-container>
        <ng-container matColumnDef="growth">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Growth</th>
          <td mat-cell *matCellDef="let row">{{ row.growth }}%</td>
        </ng-container>
        <ng-container matColumnDef="score">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Score</th>
          <td mat-cell *matCellDef="let row">{{ row.score }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </section>
  `,
  styles: [`
    .ng-sort-header { display:grid; gap:16px; padding:20px; border-radius:24px; background:white; border:1px solid #e2e8f0; }
    .ng-sort-header__header { display:flex; justify-content:space-between; gap:12px; align-items:end; flex-wrap:wrap; }
    .ng-sort-header__header p { margin:0; color:#0891b2; letter-spacing:.12em; text-transform:uppercase; font-size:.75rem; }
    .ng-sort-header__header h3 { margin:6px 0 0; }
    .ng-sort-header__header span { color:#64748b; font-weight:600; }
    .ng-sort-header__table { overflow:hidden; border-radius:18px; background:#f8fafc; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSortHeaderComponent {
  readonly eyebrow = input('Analyst view');
  readonly title = input('Sortable scorecard');
  readonly rows = input<NgSortHeaderRow[]>([
    { name: 'Northwind', pipeline: 640, growth: 28, score: 92 },
    { name: 'Fabrikam', pipeline: 420, growth: 16, score: 81 },
    { name: 'Adventure Works', pipeline: 510, growth: 22, score: 88 },
  ]);

  readonly sort = viewChild(MatSort);
  readonly displayedColumns = ['name', 'pipeline', 'growth', 'score'];
  readonly dataSource = new MatTableDataSource<NgSortHeaderRow>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = [...this.rows()];
      const sort = this.sort();
      if (sort) {
        this.dataSource.sort = sort;
      }
    });
  }
}
