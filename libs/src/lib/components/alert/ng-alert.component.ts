import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isObservable } from 'rxjs';
import { Alert, AlertInfo } from '../../models/alert';
import { AlertService } from '../../services/alert.service';
import { AlertMessageComponent } from '../alert-message/ng-alert-message.component';

@Component({
  selector: 'ng-alert',
  standalone: true,
  imports: [AlertMessageComponent],
  templateUrl: './ng-alert.component.html',
  styleUrl: './ng-alert.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private readonly alertService = inject(AlertService);
  private readonly destroyRef = inject(DestroyRef);

  alerts: Alert[] = [];

  constructor() {
    this.alertService
      .getAlert()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alert) => {
        if (alert.errors.length) {
          const nextAlert = {
            ...alert,
            id: alert.id ?? this.createId(),
          };

          this.alerts = [...this.alerts, nextAlert];
          this.resolveObservableMessages(nextAlert);

          if (nextAlert.timeout) {
            const id = nextAlert.id;
            setTimeout(() => this.removeAlertById(id), nextAlert.timeout);
          }
        } else {
          this.alerts = [];
        }
      });
  }

  getMessageText(alert: Alert): string {
    if (!alert.errors.length) {
      return 'Invalid alert message';
    }

    return alert.errors
      .map((error) => error.message)
      .filter((msg): msg is string => typeof msg === 'string' && !!msg.trim())
      .join('\n');
  }

  getAlertType(alert: Alert): 'success' | 'error' | 'info' | 'warning' {
    return alert.errors?.[0]?.errorType ?? 'info';
  }

  removeAlert(index: number): void {
    this.alerts = this.alerts.filter((_, currentIndex) => currentIndex !== index);
  }

  private removeAlertById(id?: string): void {
    if (!id) {
      return;
    }

    this.alerts = this.alerts.filter((alert) => alert.id !== id);
  }

  private createId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private resolveObservableMessages(alert: Alert): void {
    alert.errors.forEach((error, index) => {
      if (!isObservable(error.message)) {
        return;
      }

      error.message
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((message) => this.updateAlertMessage(alert.id, index, message));
    });
  }

  private updateAlertMessage(id: string | undefined, index: number, message: string): void {
    if (!id) {
      return;
    }

    this.alerts = this.alerts.map((alert) => {
      if (alert.id !== id) {
        return alert;
      }

      const errors = alert.errors.map((error: AlertInfo, currentIndex: number) =>
        currentIndex === index ? { ...error, message } : error
      );

      return { ...alert, errors };
    });
  }
}
