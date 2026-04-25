import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { ButtonComponent } from '../button/ng-button.component';
import { IconComponent, IconTone } from '../icon/ng-icon.component';

export interface NgBottomSheetAction {
  label: string;
  description?: string;
  icon?: string;
  tone?: IconTone;
  value: string;
}

interface NgBottomSheetPayload {
  eyebrow?: string;
  title: string;
  description?: string;
  highlight?: string;
  actions: NgBottomSheetAction[];
}

@Component({
  selector: 'ng-bottom-sheet-panel',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  template: `
    <div class="ng-bottom-sheet-panel">
      @if (data.eyebrow) {
        <p class="ng-bottom-sheet-panel__eyebrow">{{ data.eyebrow }}</p>
      }
      <h3>{{ data.title }}</h3>
      @if (data.description) {
        <p class="ng-bottom-sheet-panel__description">{{ data.description }}</p>
      }
      @if (data.highlight) {
        <div class="ng-bottom-sheet-panel__highlight">{{ data.highlight }}</div>
      }
      <div class="ng-bottom-sheet-panel__actions">
        @for (action of data.actions; track action.value) {
          <button type="button" class="ng-bottom-sheet-panel__action" (click)="dismiss(action.value)">
            <div class="ng-bottom-sheet-panel__action-copy">
              <span>{{ action.label }}</span>
              @if (action.description) {
                <small>{{ action.description }}</small>
              }
            </div>
            @if (action.icon) {
              <ng-icon [name]="action.icon" [tone]="action.tone ?? 'primary'"></ng-icon>
            }
          </button>
        }
      </div>
      <ng-button
        type="text"
        label="Close"
        icon="close"
        iconPosition="end"
        (buttonClick)="dismiss()"
      ></ng-button>
    </div>
  `,
  styles: [`
    .ng-bottom-sheet-panel { display:grid; gap:16px; padding:8px 4px 12px; }
    .ng-bottom-sheet-panel__eyebrow { margin:0; color:#4f46e5; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-bottom-sheet-panel h3 { margin:0; font-size:1.35rem; }
    .ng-bottom-sheet-panel__description { margin:0; color:#475569; }
    .ng-bottom-sheet-panel__highlight { padding:12px 14px; border-radius:16px; background:linear-gradient(135deg, #eef2ff, #ecfeff); color:#0f172a; font-weight:600; }
    .ng-bottom-sheet-panel__actions { display:grid; gap:10px; }
    .ng-bottom-sheet-panel__action {
      display:flex; align-items:center; justify-content:space-between; gap:12px; width:100%;
      padding:14px 16px; border:none; border-radius:18px; background:#f8fafc; cursor:pointer; text-align:left;
    }
    .ng-bottom-sheet-panel__action:hover { background:#eef2ff; }
    .ng-bottom-sheet-panel__action-copy { display:grid; gap:4px; }
    .ng-bottom-sheet-panel__action-copy span { font-weight:600; color:#0f172a; }
    .ng-bottom-sheet-panel__action-copy small { color:#64748b; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NgBottomSheetPanelComponent {
  readonly data = inject(MAT_BOTTOM_SHEET_DATA) as NgBottomSheetPayload;
  private readonly ref = inject(MatBottomSheetRef<NgBottomSheetPanelComponent, string | undefined>);

  dismiss(result?: string) {
    this.ref.dismiss(result);
  }
}

@Component({
  selector: 'ng-bottom-sheet',
  standalone: true,
  imports: [CommonModule, MatBottomSheetModule, ButtonComponent, IconComponent],
  template: `
    <section class="ng-bottom-sheet">
      <div>
        <p class="ng-bottom-sheet__eyebrow">{{ eyebrow() }}</p>
        <h3>{{ title() }}</h3>
        <p>{{ description() }}</p>
      </div>
      <div class="ng-bottom-sheet__meta">
        <span>{{ actions().length }} curated actions</span>
        <ng-button type="filled" [label]="ctaLabel()" icon="keyboard_arrow_up" (buttonClick)="openSheet()"></ng-button>
      </div>
    </section>
  `,
  styles: [`
    .ng-bottom-sheet {
      display:grid; gap:16px; padding:24px; border-radius:28px;
      background:linear-gradient(145deg, #0f172a, #1d4ed8); color:#e2e8f0;
      box-shadow:0 24px 50px rgba(15, 23, 42, .24);
    }
    .ng-bottom-sheet__eyebrow { margin:0 0 8px; color:#93c5fd; letter-spacing:.14em; text-transform:uppercase; font-size:.75rem; }
    .ng-bottom-sheet h3 { margin:0 0 10px; font-size:1.4rem; color:white; }
    .ng-bottom-sheet p { margin:0; color:#cbd5e1; }
    .ng-bottom-sheet__meta { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
    .ng-bottom-sheet__meta span { font-weight:600; color:#bfdbfe; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgBottomSheetComponent {
  private readonly bottomSheet = inject(MatBottomSheet);

  readonly eyebrow = input('Premium actions');
  readonly title = input('Member quick actions');
  readonly description = input('Open a polished mobile action sheet for tier upgrades, delivery controls, or account tasks.');
  readonly highlight = input('Smart defaults, richer copy, and concierge-style actions included.');
  readonly ctaLabel = input('Open sheet');
  readonly actions = input<NgBottomSheetAction[]>([
    { value: 'upgrade', label: 'Upgrade to Plus', description: 'Unlock faster support and priority processing.', icon: 'north_east', tone: 'primary' },
    { value: 'pause', label: 'Pause renewals', description: 'Keep access through the current billing cycle.', icon: 'pause_circle', tone: 'warning' },
    { value: 'concierge', label: 'Contact concierge', description: 'Escalate this request to a human specialist.', icon: 'support_agent', tone: 'success' },
  ]);

  readonly actionSelected = output<string | undefined>();

  openSheet() {
    this.bottomSheet
      .open(NgBottomSheetPanelComponent, {
        ariaLabel: this.title(),
        data: {
          eyebrow: this.eyebrow(),
          title: this.title(),
          description: this.description(),
          highlight: this.highlight(),
          actions: this.actions(),
        } satisfies NgBottomSheetPayload,
      })
      .afterDismissed()
      .subscribe((result) => this.actionSelected.emit(result));
  }
}
