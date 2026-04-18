import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'ng-toggle',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './ng-toggle.component.html',
  styleUrl: './ng-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgToggleComponent),
      multi: true,
    },
  ],
})
export class NgToggleComponent implements ControlValueAccessor {
  readonly label = input<string>('Toggle');
  readonly description = input<string>();
  readonly disabled = input<boolean>(false);
  readonly hideIcon = input<boolean>(false);

  readonly checked = signal<boolean>(false);
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

  onCheckedChange(event: MatSlideToggleChange) {
    this.checked.set(event.checked);
    this.onChange(event.checked);
  }

  markAsTouched() {
    this.onTouched();
  }

  isDisabled() {
    return this.disabled() || this.disabledState();
  }
}
