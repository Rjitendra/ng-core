import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ButtonComponent } from '../button/ng-button.component';
import { IconComponent, IconTone } from '../icon/ng-icon.component';

export interface NgSidenavItem {
  id: string;
  label: string;
  icon?: string;
  caption?: string;
  tone?: IconTone;
  active?: boolean;
}

@Component({
  selector: 'ng-sidenav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, ButtonComponent, IconComponent],
  template: `
    <mat-sidenav-container class="ng-sidenav">
      <mat-sidenav [mode]="mode()" [opened]="opened()" class="ng-sidenav__drawer">
        <div class="ng-sidenav__brand">
          <div>
            <p>{{ eyebrow() }}</p>
            <h3>{{ title() }}</h3>
          </div>
          <ng-button type="icon" label="Collapse" icon="close" (buttonClick)="toggle()"></ng-button>
        </div>
        <mat-nav-list>
          @for (item of items(); track item.id) {
            <button
              mat-list-item
              type="button"
              [class.ng-sidenav__item--active]="item.active"
              (click)="select(item)"
            >
              <div matListItemIcon>
                <ng-icon [name]="item.icon || 'dashboard'" [tone]="item.tone ?? 'primary'"></ng-icon>
              </div>
              <div matListItemTitle>{{ item.label }}</div>
              @if (item.caption) {
                <div matListItemLine>{{ item.caption }}</div>
              }
            </button>
          }
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="ng-sidenav__content">
        <div class="ng-sidenav__topbar">
          <div>
            <p>{{ contentEyebrow() }}</p>
            <h4>{{ contentTitle() }}</h4>
          </div>
          <ng-button type="outlined" label="Toggle nav" icon="menu" (buttonClick)="toggle()"></ng-button>
        </div>
        <div class="ng-sidenav__surface">
          <ng-content>
            <p>{{ contentDescription() }}</p>
          </ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .ng-sidenav { min-height:420px; border-radius:28px; overflow:hidden; border:1px solid #e2e8f0; }
    .ng-sidenav__drawer { width:320px; padding:18px; background:linear-gradient(180deg, #020617, #172554); color:#e2e8f0; }
    .ng-sidenav__brand { display:flex; align-items:start; justify-content:space-between; gap:12px; margin-bottom:18px; }
    .ng-sidenav__brand p, .ng-sidenav__content p { margin:0; }
    .ng-sidenav__brand p { color:#93c5fd; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-sidenav__brand h3, .ng-sidenav__content h4 { margin:6px 0 0; }
    .ng-sidenav__item--active { background:rgba(96, 165, 250, .14); border-radius:16px; }
    .ng-sidenav__content { padding:20px; background:linear-gradient(180deg, #f8fafc, #eef2ff); }
    .ng-sidenav__topbar { display:flex; justify-content:space-between; gap:16px; align-items:center; flex-wrap:wrap; margin-bottom:18px; }
    .ng-sidenav__topbar p { color:#6366f1; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-sidenav__surface { min-height:260px; padding:24px; border-radius:24px; background:white; color:#334155; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSidenavComponent {
  readonly eyebrow = input('Workspace');
  readonly title = input('Premium navigation');
  readonly items = input<NgSidenavItem[]>([
    { id: 'overview', label: 'Overview', caption: 'Pipeline and revenue health', icon: 'dashboard', active: true },
    { id: 'accounts', label: 'Accounts', caption: 'High-value customers', icon: 'groups', tone: 'success' },
    { id: 'briefings', label: 'Briefings', caption: 'Executive-ready updates', icon: 'library_books', tone: 'warning' },
  ]);
  readonly mode = input<'over' | 'push' | 'side'>('side');
  readonly initiallyOpened = input(true);
  readonly contentEyebrow = input('Executive summary');
  readonly contentTitle = input('Quarterly performance command center');
  readonly contentDescription = input('Pair the sidenav with richer dashboards, filters, and action bars for a premium workspace shell.');

  readonly itemSelected = output<NgSidenavItem>();

  readonly opened = signal(this.initiallyOpened());

  toggle() {
    this.opened.update((value) => !value);
  }

  select(item: NgSidenavItem) {
    this.itemSelected.emit(item);
  }
}
