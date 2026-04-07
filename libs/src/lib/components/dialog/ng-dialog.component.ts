import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/ng-button.component';
import { IconComponent } from '../icon/ng-icon.component';
import { NgDialogData, NgDialogResult } from '../../models/dialog';
import {
  APP_DIALOG_DATA,
  APP_DIALOG_REF,
  AppDialogRef,
} from '../../services/app-dialog.types';

@Component({
  selector: 'ng-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './ng-dialog.component.html',
  styleUrl: './ng-dialog.component.scss',
})
export class NgDialogComponent {
  readonly data = (inject(APP_DIALOG_DATA, { optional: true }) as NgDialogData) ?? {};
  private readonly dialogRef = inject(APP_DIALOG_REF) as AppDialogRef<NgDialogResult>;

  dialogType(): string {
    return this.data.type ?? 'info';
  }

  presentation(): string {
    return this.data.presentation ?? 'modal';
  }

  resolvedIcon(): string {
    if (this.data.icon) {
      return this.data.icon;
    }

    switch (this.dialogType()) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'confirm':
        return 'help';
      default:
        return 'info';
    }
  }

  resolvedConfirmText(): string {
    return this.data.confirmAction?.label ?? this.data.confirmText ?? 'OK';
  }

  resolvedCancelText(): string {
    return this.data.cancelAction?.label ?? this.data.cancelText ?? 'Cancel';
  }

  resolvedConfirmVariant(): 'filled' | 'outlined' | 'text' | 'tonal' {
    return this.data.confirmAction?.variant ?? 'filled';
  }

  resolvedCancelVariant(): 'filled' | 'outlined' | 'text' | 'tonal' {
    return this.data.cancelAction?.variant ?? 'text';
  }

  isSidebar(): boolean {
    return this.presentation() === 'sidebar';
  }

  onConfirm(): void {
    this.dialogRef.close({
      action: 'confirm',
      data: this.data.confirmAction?.value ?? this.data.data,
    });
  }

  onCancel(): void {
    this.dialogRef.close({
      action: 'cancel',
      data: this.data.cancelAction?.value ?? this.data.data,
    });
  }

  onClose(): void {
    this.dialogRef.close({
      action: 'close',
      data: this.data.data,
    });
  }
}
