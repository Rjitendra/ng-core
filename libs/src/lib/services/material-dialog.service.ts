import {
  EnvironmentProviders,
  Injectable,
  Injector,
  Provider,
  Type,
  importProvidersFrom,
  makeEnvironmentProviders,
} from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  APP_DIALOG_DATA,
  APP_DIALOG_REF,
  AppDialogRef,
  AppDialogService,
  DialogConfig,
} from './app-dialog.types';

@Injectable({
  providedIn: 'root',
})
export class MaterialDialogService implements AppDialogService {
  constructor(
    private readonly matDialog: MatDialog,
    private readonly injector: Injector
  ) {}

  open<TComponent, TData = unknown, TResult = unknown>(
    component: Type<TComponent>,
    config?: DialogConfig<TData>
  ): AppDialogRef<TResult> {
    let matDialogRef!: MatDialogRef<unknown, TResult>;

    const appDialogRef: AppDialogRef<TResult> = {
      close: (result?: TResult) => matDialogRef.close(result),
    };

    const injector = Injector.create({
      providers: [
        {
          provide: APP_DIALOG_DATA,
          useValue: config?.data,
        },
        {
          provide: APP_DIALOG_REF,
          useValue: appDialogRef,
        },
      ],
      parent: this.injector,
    });

    matDialogRef = this.matDialog.open(component as Type<unknown>, {
      injector,
      width: config?.width,
      maxWidth: config?.maxWidth,
      hasBackdrop: config?.hasBackdrop,
      backdropClass: config?.backdropClass,
      disableClose: config?.disableClose,
      autoFocus: config?.autoFocus,
      restoreFocus: config?.restoreFocus,
      panelClass: config?.panelClass,
      position: config?.position,
    });

    return appDialogRef;
  }
}

export const APP_DIALOG_PROVIDERS: Provider[] = [
  MaterialDialogService,
  {
    provide: AppDialogService,
    useExisting: MaterialDialogService,
  },
];

export function provideAppDialogs(): EnvironmentProviders {
  return makeEnvironmentProviders([
    importProvidersFrom(MatDialogModule),
    ...APP_DIALOG_PROVIDERS,
  ]);
}
