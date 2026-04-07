import { Injectable, inject } from '@angular/core';
import { NgDialogComponent } from '../components/dialog/ng-dialog.component';
import {
  NgDialogData,
  NgDialogResult,
} from '../models/dialog';
import { AppDialogRef, AppDialogService } from './app-dialog.types';

@Injectable({
  providedIn: 'root',
})
export class NgDialogService {
  private readonly appDialog = inject(AppDialogService);

  open(config: NgDialogData): AppDialogRef<NgDialogResult> {
    const presentation = config.presentation ?? 'modal';

    return this.appDialog.open<NgDialogComponent, NgDialogData, NgDialogResult>(
      NgDialogComponent,
      {
        width:
          config.width ??
          (presentation === 'popover'
            ? 'min(92vw, 420px)'
            : presentation === 'sidebar'
              ? 'min(92vw, 520px)'
              : 'min(92vw, 560px)'),
        maxWidth: config.maxWidth ?? '92vw',
        hasBackdrop: config.hasBackdrop ?? true,
        backdropClass: [
          'ng-dialog-backdrop',
          `ng-dialog-backdrop--${presentation}`,
          ...(Array.isArray(config.backdropClass)
            ? config.backdropClass
            : config.backdropClass
              ? [config.backdropClass]
              : []),
        ],
        disableClose:
          config.disableClose ?? (presentation === 'message' ? false : false),
        autoFocus: config.autoFocus ?? false,
        restoreFocus: config.restoreFocus ?? true,
        panelClass: [
          'ng-dialog-panel',
          `ng-dialog-panel--${presentation}`,
          ...(Array.isArray(config.panelClass)
            ? config.panelClass
            : config.panelClass
              ? [config.panelClass]
              : []),
        ],
        position:
          config.position ??
          (presentation === 'popover'
            ? { top: '24px', right: '24px' }
            : presentation === 'sidebar'
              ? { top: '0', right: '0' }
              : undefined),
        data: config,
      }
    );
  }

  info(config: Omit<NgDialogData, 'type'>): AppDialogRef<NgDialogResult> {
    return this.open({ ...config, type: 'info' });
  }

  success(config: Omit<NgDialogData, 'type'>): AppDialogRef<NgDialogResult> {
    return this.open({ ...config, type: 'success' });
  }

  warning(config: Omit<NgDialogData, 'type'>): AppDialogRef<NgDialogResult> {
    return this.open({ ...config, type: 'warning' });
  }

  error(config: Omit<NgDialogData, 'type'>): AppDialogRef<NgDialogResult> {
    return this.open({ ...config, type: 'error' });
  }

  confirm(config: Omit<NgDialogData, 'type'>): AppDialogRef<NgDialogResult> {
    return this.open({
      ...config,
      type: 'confirm',
      presentation: config.presentation ?? 'modal',
      showCancel: config.showCancel ?? true,
    });
  }

  confirmDialog(
    config: Omit<NgDialogData, 'type' | 'presentation'>
  ): AppDialogRef<NgDialogResult> {
    return this.open({
      ...config,
      type: 'confirm',
      presentation: 'modal',
      showCancel: config.showCancel ?? true,
    });
  }

  messageDialog(
    config: Omit<NgDialogData, 'presentation'>
  ): AppDialogRef<NgDialogResult> {
    return this.open({
      ...config,
      presentation: 'message',
      showCancel: false,
      showCloseButton: config.showCloseButton ?? true,
      confirmText: config.confirmText ?? 'OK',
    });
  }

  popoverDialog(
    config: Omit<NgDialogData, 'presentation'>
  ): AppDialogRef<NgDialogResult> {
    return this.open({
      ...config,
      presentation: 'popover',
      showCloseButton: config.showCloseButton ?? true,
      showCancel: config.showCancel ?? false,
      confirmText: config.confirmText ?? 'Got it',
    });
  }

  sidebarDialog(
    config: Omit<NgDialogData, 'presentation'>
  ): AppDialogRef<NgDialogResult> {
    return this.open({
      ...config,
      presentation: 'sidebar',
      showCloseButton: config.showCloseButton ?? true,
      showCancel: config.showCancel ?? true,
      disableClose: config.disableClose ?? false,
    });
  }
}
