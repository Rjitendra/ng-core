import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { ButtonComponent } from '../button/ng-button.component';
import { IconComponent } from '../icon/ng-icon.component';

export type NgSnackbarVariant = 'info' | 'success' | 'warning' | 'error';

interface NgSnackbarPayload {
  title: string;
  message: string;
  actionLabel?: string;
  variant: NgSnackbarVariant;
}

@Component({
  selector: 'ng-snackbar-panel',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="ng-snackbar-panel" [class]="'ng-snackbar-panel--' + data.variant">
      <ng-icon [name]="iconName()"></ng-icon>
      <div class="ng-snackbar-panel__copy">
        <strong>{{ data.title }}</strong>
        <span>{{ data.message }}</span>
      </div>
      @if (data.actionLabel) {
        <button type="button" class="ng-snackbar-panel__action" (click)="snackBarRef.dismissWithAction()">
          {{ data.actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .ng-snackbar-panel { display:flex; align-items:center; gap:14px; min-width:320px; }
    .ng-snackbar-panel__copy { display:grid; gap:2px; flex:1; }
    .ng-snackbar-panel__copy span { opacity:.84; }
    .ng-snackbar-panel__action { border:none; background:transparent; color:inherit; font-weight:700; cursor:pointer; }
    .ng-snackbar-panel--success { color:#dcfce7; }
    .ng-snackbar-panel--warning { color:#fef3c7; }
    .ng-snackbar-panel--error { color:#fee2e2; }
    .ng-snackbar-panel--info { color:#e0f2fe; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class NgSnackbarPanelComponent {
  readonly data = inject(MAT_SNACK_BAR_DATA) as NgSnackbarPayload;
  readonly snackBarRef = inject(MatSnackBarRef<NgSnackbarPanelComponent>);

  iconName() {
    switch (this.data.variant) {
      case 'success':
        return 'task_alt';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  }
}

@Component({
  selector: 'ng-snackbar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, ButtonComponent],
  template: `
    <section class="ng-snackbar">
      <div>
        <p>{{ eyebrow() }}</p>
        <h3>{{ title() }}</h3>
        <span>{{ message() }}</span>
      </div>
      <ng-button type="tonal" label="Preview snackbar" icon="notifications" (buttonClick)="open()"></ng-button>
    </section>
  `,
  styles: [`
    .ng-snackbar { display:flex; justify-content:space-between; gap:16px; align-items:center; flex-wrap:wrap; padding:22px; border-radius:24px; background:#111827; color:white; }
    .ng-snackbar p { margin:0 0 6px; color:#67e8f9; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-snackbar h3, .ng-snackbar span { margin:0; }
    .ng-snackbar span { color:#cbd5e1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSnackbarComponent {
  private readonly snackBar = inject(MatSnackBar);

  readonly eyebrow = input('System feedback');
  readonly title = input('Changes synced');
  readonly message = input('Your premium workspace settings are now live across shared devices.');
  readonly actionLabel = input('Undo');
  readonly variant = input<NgSnackbarVariant>('success');
  readonly duration = input(5000);
  readonly horizontalPosition = input<'start' | 'center' | 'end' | 'left' | 'right'>('right');
  readonly verticalPosition = input<'top' | 'bottom'>('top');

  readonly actionTriggered = output<void>();

  open() {
    this.snackBar
      .openFromComponent(NgSnackbarPanelComponent, {
        duration: this.duration(),
        horizontalPosition: this.horizontalPosition(),
        verticalPosition: this.verticalPosition(),
        panelClass: [`ng-snackbar-host`, `ng-snackbar-host--${this.variant()}`],
        data: {
          title: this.title(),
          message: this.message(),
          actionLabel: this.actionLabel(),
          variant: this.variant(),
        } satisfies NgSnackbarPayload,
      })
      .onAction()
      .subscribe(() => this.actionTriggered.emit());
  }
}
