import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { IconComponent, IconTone } from '../icon/ng-icon.component';

export interface NgListItem {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  icon?: string;
  tone?: IconTone;
  selected?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'ng-list',
  standalone: true,
  imports: [CommonModule, MatListModule, IconComponent],
  template: `
    <section class="ng-list">
      <div class="ng-list__header">
        <div>
          <p class="ng-list__eyebrow">{{ eyebrow() }}</p>
          <h3>{{ title() }}</h3>
        </div>
        @if (supportingText()) {
          <p class="ng-list__supporting">{{ supportingText() }}</p>
        }
      </div>
      <mat-nav-list>
        @for (item of items(); track item.id) {
          <button
            mat-list-item
            type="button"
            class="ng-list__item"
            [class.ng-list__item--selected]="item.selected"
            [disabled]="item.disabled"
            (click)="selectItem(item)"
          >
            <div matListItemIcon class="ng-list__icon">
              <ng-icon [name]="item.icon || 'auto_awesome'" [tone]="item.tone ?? 'primary'"></ng-icon>
            </div>
            <div matListItemTitle>{{ item.title }}</div>
            @if (item.subtitle) {
              <div matListItemLine>{{ item.subtitle }}</div>
            }
            @if (item.meta) {
              <div matListItemMeta>{{ item.meta }}</div>
            }
          </button>
        }
      </mat-nav-list>
    </section>
  `,
  styles: [`
    .ng-list { display:grid; gap:16px; padding:20px; border:1px solid #e2e8f0; border-radius:24px; background:white; }
    .ng-list__header { display:grid; gap:8px; }
    .ng-list__eyebrow { margin:0; color:#0284c7; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-list__header h3 { margin:0; font-size:1.25rem; }
    .ng-list__supporting { margin:0; color:#64748b; }
    .ng-list__item { border-radius:18px; margin-bottom:6px; }
    .ng-list__item--selected { background:linear-gradient(90deg, rgba(14,165,233,.12), rgba(99,102,241,.12)); }
    .ng-list__icon { display:grid; place-items:center; width:36px; height:36px; border-radius:12px; background:#eff6ff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgListComponent {
  readonly eyebrow = input('Priority queue');
  readonly title = input('Premium list');
  readonly supportingText = input('Use richer rows for navigation, plans, inboxes, or account states.');
  readonly items = input<NgListItem[]>([
    { id: '01', title: 'Launch readiness review', subtitle: 'Cross-team checkpoint with design and marketing.', meta: 'Today', icon: 'rocket_launch', tone: 'primary', selected: true },
    { id: '02', title: 'Contract signature', subtitle: 'Waiting for the final approver to sign.', meta: 'Needs action', icon: 'signature', tone: 'warning' },
    { id: '03', title: 'Customer handoff', subtitle: 'Enablement notes prepared and shared.', meta: 'Ready', icon: 'handshake', tone: 'success' },
  ]);

  readonly itemSelected = output<NgListItem>();

  selectItem(item: NgListItem) {
    if (!item.disabled) {
      this.itemSelected.emit(item);
    }
  }
}
