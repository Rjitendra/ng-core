import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'ng-checkbox',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule],
  templateUrl: './ng-checkbox.component.html',
  styleUrl: './ng-checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgCheckboxComponent),
      multi: true,
    },
  ],
})
export class NgCheckboxComponent implements ControlValueAccessor {
  readonly label = input<string>('Checkbox');
  readonly description = input<string>();
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);

  readonly checked = signal<boolean>(false);
  readonly touched = signal<boolean>(false);
  readonly disabledState = signal<boolean>(false);

  private onChange: (value: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  onCheckedChange(event: MatCheckboxChange) {
    this.checked.set(event.checked);
    this.onChange(event.checked);
  }

  markAsTouched() {
    if (!this.touched()) {
      this.touched.set(true);
    }
    this.onTouched();
  }

  isDisabled() {
    return this.disabled() || this.disabledState();
  }
}
