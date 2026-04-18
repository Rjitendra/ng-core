import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgErrorComponent, NgErrorValue } from '../error/ng-error.component';
import { NgLabelComponent } from '../label/ng-label.component';

export type NgDatepickerAppearance = 'outline' | 'fill';

@Component({
  selector: 'ng-datepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgLabelComponent,
    NgErrorComponent,
  ],
  templateUrl: './ng-datepicker.component.html',
  styleUrl: './ng-datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgDatepickerComponent),
      multi: true,
    },
  ],
})
export class NgDatepickerComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly helperText = input<string>();
  readonly errorText = input<NgErrorValue>();
  readonly placeholder = input<string>('Choose a date');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly appearance = input<NgDatepickerAppearance>('outline');
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);
  readonly touchUi = input<boolean>(false);
  readonly startView = input<'month' | 'year' | 'multi-year'>('month');
  readonly id = input<string>(`ng-datepicker-${Math.random().toString(36).slice(2, 9)}`);

  readonly value = signal<Date | null>(null);
  readonly touched = signal<boolean>(false);
  readonly disabledState = signal<boolean>(false);
  readonly resolvedDisabled = computed(() => this.disabled() || this.disabledState());

  private onChange: (value: Date | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: Date | string | null): void {
    if (typeof value === 'string') {
      this.value.set(value ? new Date(value) : null);
      return;
    }
    this.value.set(value);
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  updateValue(value: Date | null) {
    this.value.set(value);
    this.onChange(value);
  }

  markAsTouched() {
    if (!this.touched()) {
      this.touched.set(true);
    }
    this.onTouched();
  }

  showError() {
    return !!this.errorText() && this.touched();
  }
}
