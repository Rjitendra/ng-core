import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Alert, AlertInfo, AlertType } from '../models/alert';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly alertsSubject = new Subject<Alert>();

  getAlert(): Observable<Alert> {
    return this.alertsSubject.asObservable();
  }

  showAlert(alertData: Alert, clearExisting?: boolean): void {
    if (clearExisting) {
      this.alertsSubject.next({ errors: [], timeout: 0 });
    }

    this.alertsSubject.next(alertData);
  }

  info(alertData: Alert): void {
    this.alertsSubject.next(this.setAlertType(alertData, 'info'));
  }

  warning(alertData: Alert): void {
    this.alertsSubject.next(this.setAlertType(alertData, 'warning'));
  }

  success(alertData: Alert): void {
    this.alertsSubject.next(this.setAlertType(alertData, 'success'));
  }

  error(alertData: Alert): void {
    this.alertsSubject.next(this.setAlertType(alertData, 'error'));
  }

  clearAlert(): void {
    this.alertsSubject.next({ errors: [], timeout: 0 });
  }

  show(alertData: Alert, clearExisting?: boolean): void {
    this.showAlert(alertData, clearExisting);
  }

  clear(): void {
    this.clearAlert();
  }

  private setAlertType(alertData: Alert, alertType: AlertType): Alert {
    alertData.errors.forEach((error: AlertInfo) => {
      error.errorType = alertType;
    });

    return alertData;
  }
}
