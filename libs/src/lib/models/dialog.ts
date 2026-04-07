import { TemplateRef } from '@angular/core';
import { DialogConfig } from '../services/app-dialog.types';

export type NgDialogType =
  | 'info'
  | 'warning'
  | 'error'
  | 'success'
  | 'confirm';

export type NgDialogPresentation = 'modal' | 'message' | 'popover' | 'sidebar';

export interface NgDialogAction {
  label: string;
  value?: unknown;
  icon?: string;
  variant?: 'text' | 'outlined' | 'filled' | 'tonal';
  disabled?: boolean;
}

export interface NgDialogData extends DialogConfig<unknown> {
  title?: string;
  message?: string;
  details?: string[];
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  showCloseButton?: boolean;
  icon?: string;
  type?: NgDialogType;
  presentation?: NgDialogPresentation;
  confirmAction?: NgDialogAction;
  cancelAction?: NgDialogAction;
  contentTemplate?: TemplateRef<unknown>;
}

export interface NgDialogResult {
  action: 'confirm' | 'cancel' | 'close';
  data?: unknown;
}
