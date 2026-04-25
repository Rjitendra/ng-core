import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'ng-paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  template: `
    <section class="ng-paginator">
      <div class="ng-paginator__summary">
        <div>
          <p class="ng-paginator__eyebrow">{{ eyebrow() }}</p>
          <h3>{{ title() }}</h3>
        </div>
        <strong>{{ rangeLabel() }}</strong>
      </div>
      <mat-paginator
        [length]="length()"
        [pageIndex]="pageIndex()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="pageSizeOptions()"
        [showFirstLastButtons]="showFirstLastButtons()"
        (page)="onPage($event)"
      ></mat-paginator>
    </section>
  `,
  styles: [`
    .ng-paginator { display:grid; gap:16px; padding:18px 20px; border-radius:24px; background:linear-gradient(180deg, #f8fafc, #eef2ff); }
    .ng-paginator__summary { display:flex; justify-content:space-between; gap:16px; align-items:end; flex-wrap:wrap; }
    .ng-paginator__eyebrow { margin:0; color:#7c3aed; letter-spacing:.12em; text-transform:uppercase; font-size:.75rem; }
    .ng-paginator__summary h3 { margin:4px 0 0; }
    .ng-paginator__summary strong { color:#312e81; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgPaginatorComponent {
  readonly eyebrow = input('Data navigation');
  readonly title = input('Premium paginator');
  readonly length = input(128);
  readonly pageIndex = input(0);
  readonly pageSize = input(12);
  readonly pageSizeOptions = input<number[]>([12, 24, 48]);
  readonly showFirstLastButtons = input(true);

  readonly pageChanged = output<PageEvent>();

  readonly rangeLabel = computed(() => {
    if (this.length() === 0) {
      return 'No records';
    }
    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min(this.length(), start + this.pageSize() - 1);
    return `${start}-${end} of ${this.length()}`;
  });

  onPage(event: PageEvent) {
    this.pageChanged.emit(event);
  }
}
