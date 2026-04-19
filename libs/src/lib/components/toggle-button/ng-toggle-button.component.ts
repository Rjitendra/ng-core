import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'ng-toggle-button',
  standalone: true,
  imports: [FormsModule, MatButtonToggleModule],
  templateUrl: './ng-toggle-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgToggleButtonComponent),
      multi: true,
    },
  ],
})
export class NgToggleButtonComponent implements ControlValueAccessor {
  readonly options = input<{ label: string; value: unknown }[]>([]);
  readonly appearance = input<'standard' | 'legacy'>('standard');
  readonly disabled = input(false);
  readonly multiple = input(false);
  readonly hideSingleSelectionIndicator = input(false);
  readonly hideMultipleSelectionIndicator = input(false);

  readonly selectionChange = output<unknown>();

  value: unknown;

  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(obj: unknown): void {
    this.value = obj;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = () => {
      fn();
    };
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.value = this.multiple() ? [] : null;
    }
  }

  onToggleChange(event: { value?: unknown }) {
    this.value = event.value;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
    this.onTouched();
  }
}
