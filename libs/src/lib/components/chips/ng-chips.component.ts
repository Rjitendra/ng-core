import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipEvent, MatChipsModule } from '@angular/material/chips';
import { IconComponent } from '../icon/ng-icon.component';

export interface NgChipItem {
  id: string;
  label: string;
  value?: string;
  removable?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

@Component({
  selector: 'ng-chips',
  standalone: true,
  imports: [CommonModule, FormsModule, MatChipsModule, IconComponent],
  templateUrl: './ng-chips.component.html',
  styleUrl: './ng-chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgChipsComponent),
      multi: true,
    },
  ],
})
export class NgChipsComponent implements ControlValueAccessor {
  readonly items = input<NgChipItem[]>([]);
  readonly selectable = input<boolean>(true);
  readonly multiple = input<boolean>(true);
  readonly removable = input<boolean>(true);
  readonly disabled = input<boolean>(false);

  readonly chipRemove = output<NgChipItem>();

  readonly value = signal<string[]>([]);
  readonly disabledState = signal<boolean>(false);

  private onChange: (value: string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string[] | null): void {
    this.value.set(value ?? []);
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  isDisabled() {
    return this.disabled() || this.disabledState();
  }

  isSelected(item: NgChipItem) {
    return this.value().includes(item.value ?? item.id);
  }

  toggleChip(item: NgChipItem) {
    if (!this.selectable() || this.isDisabled() || item.disabled) {
      return;
    }

    const chipValue = item.value ?? item.id;
    const current = this.value();
    const next = this.multiple()
      ? this.isSelected(item)
        ? current.filter((value) => value !== chipValue)
        : [...current, chipValue]
      : this.isSelected(item)
        ? []
        : [chipValue];

    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  removeChip(item: NgChipItem, event: MatChipEvent) {
    if (this.isDisabled() || item.disabled || !(item.removable ?? this.removable())) {
      return;
    }

    const chipValue = item.value ?? item.id;
    const next = this.value().filter((value) => value !== chipValue);
    this.value.set(next);
    this.onChange(next);
    this.chipRemove.emit(item);
  }
}
