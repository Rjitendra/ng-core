import { InjectionToken, Type } from '@angular/core';

export interface AppDialogRef<TResult = unknown> {
  close(result?: TResult): void;
}

export interface DialogConfig<TData = unknown> {
  data?: TData;
  width?: string;
  maxWidth?: string;
  hasBackdrop?: boolean;
  backdropClass?: string | string[];
  disableClose?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  panelClass?: string | string[];
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

export const APP_DIALOG_DATA = new InjectionToken<unknown>('APP_DIALOG_DATA');
export const APP_DIALOG_REF = new InjectionToken<AppDialogRef<unknown>>(
  'APP_DIALOG_REF'
);

export abstract class AppDialogService {
  abstract open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config?: DialogConfig<TData>
  ): AppDialogRef<TResult>;
}
