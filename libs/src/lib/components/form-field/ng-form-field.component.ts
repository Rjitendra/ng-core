import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgErrorComponent, NgErrorValue } from '../error/ng-error.component';
import { NgLabelComponent } from '../label/ng-label.component';

export type NgFormFieldAppearance = 'outline' | 'fill';

@Component({
  selector: 'ng-form-field',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, NgErrorComponent, NgLabelComponent],
  templateUrl: './ng-form-field.component.html',
  styleUrl: './ng-form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgFormFieldComponent {
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly helperText = input<string>();
  readonly errorText = input<NgErrorValue>();
  readonly required = input<boolean>(false);
  readonly optional = input<boolean>(false);
  readonly appearance = input<NgFormFieldAppearance>('outline');
  readonly id = input<string>(`ng-form-field-${Math.random().toString(36).slice(2, 9)}`);

  hasError() {
    const value = this.errorText();
    return Array.isArray(value) ? value.length > 0 : !!value;
  }
}
