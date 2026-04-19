import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AlertComponent } from './components/alert/ng-alert.component';
import { AlertMessageComponent } from './components/alert-message/ng-alert-message.component';
import { NgAccordionComponent } from './components/accordion/ng-accordion.component';
import { NgAdvancedCardComponent } from './components/advanced-card/ng-advanced-card.component';
import { NgAutocompleteComponent } from './components/autocomplete/ng-autocomplete.component';
import { ButtonComponent } from './components/button/ng-button.component';
import { NgBadgeComponent } from './components/badge/ng-badge.component';
import { NgCardComponent } from './components/card/ng-card.component';
import { NgCheckboxComponent } from './components/checkbox/ng-checkbox.component';
import { NgChipsComponent } from './components/chips/ng-chips.component';
import { NgClarifyTextComponent } from './components/clarify-text/ng-clarify-text.component';
import { NgDatepickerComponent } from './components/datepicker/ng-datepicker.component';
import { NgDialogComponent } from './components/dialog/ng-dialog.component';
import { NgDividerComponent } from './components/divider/ng-divider.component';
import { NgDropdownComponent } from './components/dropdown/ng-dropdown.component';
import { NgErrorComponent } from './components/error/ng-error.component';
import { NgFileUploadComponent } from './components/file-upload/ng-file-upload.component';
import { NgFormFieldComponent } from './components/form-field/ng-form-field.component';
import { NgLabelComponent } from './components/label/ng-label.component';
import { IconComponent } from './components/icon/ng-icon.component';
import { NgInputComponent } from './components/input/ng-input.component';
import { NgLayoutComponent } from './components/layout/ng-layout.component';
import { NgLoadingOverlayComponent } from './components/loading-overlay/ng-loading-overlay.component';
import { NgMatTableComponent } from './components/mat-table/ng-mat-table.component';
import { NgMenuComponent } from './components/menu/ng-menu.component';
import { NgMenuItemDirective } from './components/menu/ng-menu-item.directive';
import { NgMenuTriggerForDirective } from './components/menu/ng-menu-trigger.directive';
import { NgProgressBarComponent } from './components/progress-bar/ng-progress-bar.component';
import { NgRadioGroupComponent } from './components/radio/ng-radio-group.component';
import { NgSelectComponent } from './components/select/ng-select.component';
import { NgSliderComponent } from './components/slider/ng-slider.component';
import { SpinnerComponent } from './components/spinner/ng-spinner.component';
import { NgStepperComponent } from './components/stepper/ng-stepper.component';
import { NgTextareaComponent } from './components/textarea/ng-textarea.component';
import { NgTextboxComponent } from './components/textbox/ng-textbox.component';
import { NgTileComponent } from './components/tile/ng-tile.component';
import { NgToggleButtonComponent } from './components/toggle-button/ng-toggle-button.component';
import { NgTreeComponent } from './components/tree/ng-tree.component';
import { NgToggleComponent } from './components/toggle/ng-toggle.component';
import { APP_DIALOG_PROVIDERS } from './services/material-dialog.service';

@NgModule({
  imports: [
    AlertComponent,
    AlertMessageComponent,
    NgAccordionComponent,
    NgAdvancedCardComponent,
    NgAutocompleteComponent,
    NgBadgeComponent,
    ButtonComponent,
    NgCardComponent,
    NgCheckboxComponent,
    NgChipsComponent,
    NgClarifyTextComponent,
    NgDatepickerComponent,
    MatDialogModule,
    NgDialogComponent,
    NgDividerComponent,
    NgDropdownComponent,
    NgErrorComponent,
    NgFileUploadComponent,
    NgFormFieldComponent,
    IconComponent,
    NgInputComponent,
    NgLabelComponent,
    NgLayoutComponent,
    NgLoadingOverlayComponent,
    NgMatTableComponent,
    NgMenuComponent,
    NgMenuItemDirective,
    NgMenuTriggerForDirective,
    NgProgressBarComponent,
    NgRadioGroupComponent,
    NgSelectComponent,
    NgSliderComponent,
    SpinnerComponent,
    NgStepperComponent,
    NgTextareaComponent,
    NgTextboxComponent,
    NgTileComponent,
    NgToggleButtonComponent,
    NgTreeComponent,
    NgToggleComponent,
  ],
  exports: [
    AlertComponent,
    AlertMessageComponent,
    NgAccordionComponent,
    NgAdvancedCardComponent,
    NgAutocompleteComponent,
    NgBadgeComponent,
    ButtonComponent,
    NgCardComponent,
    NgCheckboxComponent,
    NgChipsComponent,
    NgClarifyTextComponent,
    NgDatepickerComponent,
    MatDialogModule,
    NgDialogComponent,
    NgDividerComponent,
    NgDropdownComponent,
    NgErrorComponent,
    NgFileUploadComponent,
    NgFormFieldComponent,
    IconComponent,
    NgInputComponent,
    NgLabelComponent,
    NgLayoutComponent,
    NgLoadingOverlayComponent,
    NgMatTableComponent,
    NgMenuComponent,
    NgMenuItemDirective,
    NgMenuTriggerForDirective,
    NgProgressBarComponent,
    NgRadioGroupComponent,
    NgSelectComponent,
    NgSliderComponent,
    SpinnerComponent,
    NgStepperComponent,
    NgTextareaComponent,
    NgTextboxComponent,
    NgTileComponent,
    NgToggleButtonComponent,
    NgTreeComponent,
    NgToggleComponent,
  ],
  providers: [...APP_DIALOG_PROVIDERS],
})
export class SharedControlsModule {}
