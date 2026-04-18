import { CommonModule } from '@angular/common';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatOptionSelectionChange } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { IconComponent } from '../icon/ng-icon.component';
import { NgErrorComponent, NgErrorValue } from '../error/ng-error.component';
import { NgLabelComponent } from '../label/ng-label.component';

export interface NgDropdownOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: string;
  group?: string;
  keywords?: string[];
}

export type NgDropdownAppearance = 'outline' | 'fill';
export type NgDropdownSize = 'sm' | 'md' | 'lg';

export interface NgDropdownGroup<T = string> {
  label: string;
  disabled?: boolean;
  options: NgDropdownOption<T>[];
}

interface NgResolvedDropdownGroup<T = string> {
  label: string | null;
  disabled: boolean;
  options: NgDropdownOption<T>[];
}

const SELECT_ALL_SENTINEL = '__ng_dropdown_select_all__';

@Component({
  selector: 'ng-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
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
  readonly toolTip = input<string>();
  readonly placeholder = input<string>('Select an option');
  readonly helperText = input<string>();
  readonly errorText = input<NgErrorValue>();
  readonly options = input<NgDropdownOption<T>[]>([]);
  readonly groups = input<NgDropdownGroup<T>[]>([]);
  readonly appearance = input<NgDropdownAppearance>('outline');
  readonly size = input<NgDropdownSize>('md');
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly selectAll = input<boolean>(false);
  readonly clearable = input<boolean>(false);
  readonly prefixIcon = input<string>();
  readonly suffixIcon = input<string>();
  readonly searchable = input<boolean>(false);
  readonly searchPlaceholder = input<string>('Search options');
  readonly noResultsText = input<string>('No options found');
  readonly panelClass = input<string | string[]>();
  readonly compareWith = input<(first: T | null, second: T | null) => boolean>();
  readonly id = input<string>(`ng-dropdown-${Math.random().toString(36).slice(2, 9)}`);

  readonly value = signal<T | T[] | null>(null);
  readonly touched = signal<boolean>(false);
  readonly disabledState = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly isOpen = signal<boolean>(false);

  readonly selectionChange = output<T | T[] | null>();
  readonly openedChange = output<boolean>();

  readonly resolvedDisabled = computed(() => this.disabled() || this.disabledState());
  readonly normalizedGroups = computed<NgResolvedDropdownGroup<T>[]>(() => {
    if (this.groups().length) {
      return this.groups().map((group) => ({
        label: group.label,
        disabled: !!group.disabled,
        options: group.options,
      }));
    }

    const grouped = new Map<string, NgDropdownOption<T>[]>();
    const ungrouped: NgDropdownOption<T>[] = [];

    for (const option of this.options()) {
      if (!option.group) {
        ungrouped.push(option);
        continue;
      }

      grouped.set(option.group, [...(grouped.get(option.group) ?? []), option]);
    }

    const result: NgResolvedDropdownGroup<T>[] = [];
    if (ungrouped.length) {
      result.push({
        label: null,
        disabled: false,
        options: ungrouped,
      });
    }

    for (const [label, options] of grouped.entries()) {
      result.push({
        label,
        disabled: false,
        options,
      });
    }

    return result;
  });
  readonly filteredGroups = computed<NgResolvedDropdownGroup<T>[]>(() => {
    const query = this.searchTerm().trim().toLowerCase();
    if (!query) {
      return this.normalizedGroups();
    }

    return this.normalizedGroups()
      .map((group) => ({
        ...group,
        options: group.options.filter((option) => this.matchesSearch(option, query)),
      }))
      .filter((group) => group.options.length > 0);
  });
  readonly selectableOptions = computed(() =>
    this.filteredGroups()
      .flatMap((group) => group.options)
      .filter((option) => !option.disabled)
  );
  readonly selectedValues = computed<T[]>(() => {
    const current = this.value();
    if (!this.multiple()) {
      return current === null ? [] : [current as T];
    }

    return Array.isArray(current) ? current : [];
  });
  readonly selectedLabels = computed(() => {
    const allOptions = this.normalizedGroups().flatMap((group) => group.options);
    return this.selectedValues()
      .map((value) => allOptions.find((option) => this.isSameValue(option.value, value))?.label)
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
  readonly resolvedCompareWith = computed<(first: T | null, second: T | null) => boolean>(
    () => this.compareWith() ?? ((first, second) => first === second)
  );
  readonly resolvedPanelClass = computed<string | string[]>(() => this.panelClass() ?? []);

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
      this.selectionChange.emit(nextValues);
      return;
    }

    this.value.set(value);
    this.onChange(value);
    this.selectionChange.emit(value);
  }

  toggleAll() {
    const nextValue = this.allSelected()
      ? []
      : this.selectableOptions().map((option) => option.value);

    this.value.set(nextValue);
    this.onChange(nextValue);
    this.selectionChange.emit(nextValue);
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
    this.selectionChange.emit(nextValue);
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

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement | null;
    this.searchTerm.set((target?.value ?? '').toString());
  }

  onOpenedStateChange(opened: boolean) {
    this.isOpen.set(opened);
    if (!opened) {
      this.searchTerm.set('');
      this.markAsTouched();
    }
    this.openedChange.emit(opened);
  }

  onSelectionChanged(event: MatSelectChange) {
    this.updateValue(event.value as T | T[] | null);
  }

  visibleGroupCount() {
    return this.filteredGroups().length;
  }

  hasAnyVisibleOption() {
    return this.filteredGroups().some((group) => group.options.length > 0);
  }

  selectAllLabel() {
    const total = this.selectableOptions().length;
    const selected = this.selectedValues().length;
    return this.allSelected()
      ? `Clear all (${selected}/${total})`
      : `Select all (${selected}/${total})`;
  }

  trackGroup(_: number, group: NgResolvedDropdownGroup<T>) {
    return group.label ?? 'ungrouped';
  }

  trackOption(_: number, option: NgDropdownOption<T>) {
    return option.label;
  }

  private isSameValue(first: T | null, second: T | null) {
    const compare = this.compareWith();
    return compare ? compare(first, second) : first === second;
  }

  private matchesSearch(option: NgDropdownOption<T>, query: string) {
    const haystacks = [
      option.label,
      option.description ?? '',
      ...(option.keywords ?? []),
    ];

    return haystacks.some((value) => value.toLowerCase().includes(query));
  }
}
