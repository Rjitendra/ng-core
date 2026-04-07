import { NgModule } from '@angular/core';
import { AlertComponent } from './components/alert/ng-alert.component';
import { AlertMessageComponent } from './components/alert-message/ng-alert-message.component';
import { ButtonComponent } from './components/button/ng-button.component';
import { IconComponent } from './components/icon/ng-icon.component';
import { SpinnerComponent } from './components/spinner/ng-spinner.component';

@NgModule({
  imports: [
    AlertComponent,
    AlertMessageComponent,
    ButtonComponent,
    IconComponent,
    SpinnerComponent,
  ],
  exports: [
    AlertComponent,
    AlertMessageComponent,
    ButtonComponent,
    IconComponent,
    SpinnerComponent,
  ],
})
export class SharedControlsModule {}
