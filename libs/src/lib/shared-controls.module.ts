import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertComponent } from './components/alert/ng-alert.component';
import { AlertMessageComponent } from './components/alert-message/ng-alert-message.component';
import { ButtonComponent } from './components/button/ng-button.component';
import { NgDialogComponent } from './components/dialog/ng-dialog.component';
import { IconComponent } from './components/icon/ng-icon.component';
import { NgLoadingOverlayComponent } from './components/loading-overlay/ng-loading-overlay.component';
import { SpinnerComponent } from './components/spinner/ng-spinner.component';
import { NgTreeComponent } from './components/tree/ng-tree.component';
import { APP_DIALOG_PROVIDERS } from './services/material-dialog.service';

@NgModule({
  imports: [
    AlertComponent,
    AlertMessageComponent,
    ButtonComponent,
    MatDialogModule,
    NgDialogComponent,
    IconComponent,
    NgLoadingOverlayComponent,
    SpinnerComponent,
    NgTreeComponent,
  ],
  exports: [
    AlertComponent,
    AlertMessageComponent,
    ButtonComponent,
    MatDialogModule,
    NgDialogComponent,
    IconComponent,
    NgLoadingOverlayComponent,
    SpinnerComponent,
    NgTreeComponent,
  ],
  providers: [...APP_DIALOG_PROVIDERS],
})
export class SharedControlsModule {}
