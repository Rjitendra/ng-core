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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatOptionSelectionChange } from '@angular/material/core';
import { IconComponent } from '../icon/ng-icon.component';
import { NgErrorComponent, NgErrorValue } from '../error/ng-error.component';
import { NgLabelComponent } from '../label/ng-label.component';

export interface NgDropdownOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type NgDropdownAppearance = 'outline' | 'fill';
export type NgDropdownSize = 'sm' | 'md' | 'lg';

const SELECT_ALL_SENTINEL = '__ng_dropdown_select_all__';

@Component({
  selector: 'ng-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    IconComponent,
    NgErrorComponent,
    NgLabelComponent,
  ],
  templateUrl: './ng-dropdown.component.html',
  styleUrl: './ng-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgDropdownComponent),
      multi: true,
    },
  ],
  host: {
    class: 'ng-dropdown-host',
    '[class.ng-dropdown--sm]': "size() === 'sm'",
    '[class.ng-dropdown--md]': "size() === 'md'",
    '[class.ng-dropdown--lg]': "size() === 'lg'",
  },
})
export class NgDropdownComponent<T = string>
  implements ControlValueAccessor
{
  readonly selectAllSentinel = SELECT_ALL_SENTINEL;
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly placeholder = input<string>('Select an option');
  readonly helperText = input<string>();
  readonly errorText = input<NgErrorValue>();
  readonly options = input<NgDropdownOption<T>[]>([]);
  readonly appearance = input<NgDropdownAppearance>('outline');
  readonly size = input<NgDropdownSize>('md');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly selectAll = input<boolean>(false);
  readonly clearable = input<boolean>(false);
  readonly prefixIcon = input<string>();
  readonly id = input<string>(`ng-dropdown-${Math.random().toString(36).slice(2, 9)}`);

  readonly value = signal<T | T[] | null>(null);
  readonly touched = signal<boolean>(false);
  readonly disabledState = signal<boolean>(false);

  readonly resolvedDisabled = computed(() => this.disabled() || this.disabledState());
  readonly selectableOptions = computed(() =>
    this.options().filter((option) => !option.disabled)
  );
  readonly selectedValues = computed<T[]>(() => {
    const current = this.value();
    if (!this.multiple()) {
      return current === null ? [] : [current as T];
    }

    return Array.isArray(current) ? current : [];
  });
  readonly selectedLabels = computed(() => {
    const optionMap = new Map(this.options().map((option) => [option.value, option.label]));
    return this.selectedValues()
      .map((value) => optionMap.get(value))
      .filter((value): value is string => !!value);
  });
  readonly allSelected = computed(() => {
    if (!this.multiple()) {
      return false;
    }

    const selectableValues = this.selectableOptions().map((option) => option.value);
    return (
      selectableValues.length > 0 &&
      selectableValues.every((value) => this.selectedValues().includes(value))
    );
  });
  readonly describedBy = computed(() => {
    const ids: string[] = [];
    if (this.helperText()) {
      ids.push(`${this.id()}-helper`);
    }
    if (this.errorText()) {
      ids.push(`${this.id()}-error`);
    }
    return ids.join(' ') || null;
  });

  private onChange: (value: T | T[] | null) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: T | T[] | null): void {
    if (this.multiple()) {
      this.value.set(Array.isArray(value) ? value : value === null ? [] : [value]);
      return;
    }

    this.value.set(value);
  }

  registerOnChange(fn: (value: T | T[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  updateValue(value: T | T[] | null) {
    if (this.multiple()) {
      const nextValues = (Array.isArray(value) ? value : value ? [value] : []).filter(
        (item): item is T => item !== (SELECT_ALL_SENTINEL as T)
      );

      this.value.set(nextValues);
      this.onChange(nextValues);
      return;
    }

    this.value.set(value);
    this.onChange(value);
  }

  toggleAll() {
    const nextValue = this.allSelected()
      ? []
      : this.selectableOptions().map((option) => option.value);

    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  onSelectAllOptionChange(event: MatOptionSelectionChange<string>) {
    if (!event.isUserInput) {
      return;
    }

    this.toggleAll();
  }

  clearValue(event?: MouseEvent) {
    event?.stopPropagation();
    const nextValue = this.multiple() ? [] : null;
    this.value.set(nextValue);
    this.onChange(nextValue);
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

  selectValue() {
    return this.multiple() ? this.selectedValues() : this.value();
  }

  selectAllLabel() {
    const total = this.selectableOptions().length;
    const selected = this.selectedValues().length;
    return this.allSelected()
      ? `Clear all (${selected}/${total})`
      : `Select all (${selected}/${total})`;
  }
}
