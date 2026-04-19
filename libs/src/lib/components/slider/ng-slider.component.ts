import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';
import { NgClarifyTextComponent } from '../clarify-text/ng-clarify-text.component';
import { NgLabelComponent } from '../label/ng-label.component';

@Component({
  selector: 'ng-slider',
  standalone: true,
  imports: [MatSliderModule, NgLabelComponent, NgClarifyTextComponent],
  templateUrl: './ng-slider.component.html',
  styleUrl: './ng-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgSliderComponent),
      multi: true,
    },
  ],
})
export class NgSliderComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly disabled = input(false);
  readonly required = input(false);
  readonly discrete = input(false);
  readonly showTickMarks = input(false);
  readonly showMinMax = input(true);
  readonly showValue = input(true);
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly uniqueId = input(`ng-slider-${Math.random().toString(36).slice(2, 9)}`);
  readonly name = input('ng-slider');
  readonly clarifyText = input('');
  readonly hint = input('');
  readonly valueUnit = input('');
  readonly displayValue = input<string | number | undefined>(undefined);

  readonly valueChange = output<number>();
  readonly dragEnd = output<unknown>();

  value = 0;
  private readonly disabledFromCva = signal(false);
  readonly resolvedDisabled = computed(() => this.disabled() || this.disabledFromCva());

  private onChange = (value: number) => {};
  private onTouched = () => {};

  writeValue(value: number): void {
    this.value = value ?? this.min();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCva.set(isDisabled);
  }

  onValueChange(newValue: number): void {
    this.value = newValue;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onDragEnd(event: unknown): void {
    this.onTouched();
    this.dragEnd.emit(event);
  }

  resolvedDisplayValue() {
    const d = this.displayValue();
    if (d !== undefined && d !== null && d !== '') {
      return d;
    }
    return this.value || this.min();
  }
}
