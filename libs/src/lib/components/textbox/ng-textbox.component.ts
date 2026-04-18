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
import { MatInputModule } from '@angular/material/input';
import { IconComponent } from '../icon/ng-icon.component';
import { NgLabelComponent } from '../label/ng-label.component';

export type TextboxAppearance = 'outline' | 'fill';
export type TextboxSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ng-textbox',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    IconComponent,
    NgLabelComponent,
  ],
  templateUrl: './ng-textbox.component.html',
  styleUrl: './ng-textbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgTextboxComponent),
      multi: true,
    },
  ],
  host: {
    class: 'ng-textbox-host',
    '[class.ng-textbox--sm]': "size() === 'sm'",
    '[class.ng-textbox--md]': "size() === 'md'",
    '[class.ng-textbox--lg]': "size() === 'lg'",
  },
})
export class NgTextboxComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly hint = input<string>();
  readonly placeholder = input<string>('');
  readonly type = input<string>('text');
  readonly size = input<TextboxSize>('md');
  readonly appearance = input<TextboxAppearance>('outline');
  readonly helperText = input<string>();
  readonly errorText = input<string>();
  readonly prefixIcon = input<string>();
  readonly suffixIcon = input<string>();
  readonly required = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly multiline = input<boolean>(false);
  readonly rows = input<number>(4);
  readonly maxLength = input<number>();
  readonly autocomplete = input<string>();
  readonly id = input<string>(`ng-textbox-${Math.random().toString(36).slice(2, 9)}`);

  readonly value = signal<string>('');
  readonly touched = signal<boolean>(false);
  readonly disabledState = signal<boolean>(false);
  readonly resolvedDisabled = computed(() => this.disabled() || this.disabledState());
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

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }

  updateValue(value: string) {
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
