import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { NgLabelComponent } from '../label/ng-label.component';

export interface NgRadioOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type NgRadioOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'ng-radio-group',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, NgLabelComponent],
  templateUrl: './ng-radio-group.component.html',
  styleUrl: './ng-radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgRadioGroupComponent),
      multi: true,
    },
  ],
  host: {
    class: 'ng-radio-host',
    '[class.ng-radio--horizontal]': "orientation() === 'horizontal'",
  },
})
export class NgRadioGroupComponent<T = string> implements ControlValueAccessor {
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly options = input<NgRadioOption<T>[]>([]);
  readonly orientation = input<NgRadioOrientation>('vertical');
  readonly disabled = input<boolean>(false);
  readonly name = input<string>(`ng-radio-${Math.random().toString(36).slice(2, 9)}`);

  readonly value = signal<T | null>(null);
  readonly disabledState = signal<boolean>(false);

  private onChange: (value: T | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: T | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  selectValue(value: T | null) {
    this.value.set(value);
    this.onChange(value);
  }

  markAsTouched() {
    this.onTouched();
  }

  isDisabled(option?: NgRadioOption<T>) {
    return this.disabled() || this.disabledState() || !!option?.disabled;
  }

  trackOption(_: number, option: NgRadioOption<T>) {
    return JSON.stringify(option.value);
  }
}
