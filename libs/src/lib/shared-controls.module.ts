import { NgModule } from '@angular/core';
import { ButtonComponent } from './components/button/ng-button.component';
import { SpinnerComponent } from './components/spinner/ng-spinner.component';

@NgModule({
  imports: [ButtonComponent, SpinnerComponent],
  exports: [ButtonComponent, SpinnerComponent],
})
export class SharedControlsModule {}
