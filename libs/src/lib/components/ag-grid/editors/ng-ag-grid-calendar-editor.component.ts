import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-enterprise';

@Component({
  selector: 'ng-ag-grid-calendar-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      #inputEl
      class="ng-ag-grid-editor ng-ag-grid-editor--date"
      type="date"
      [value]="value"
      (input)="value = inputEl.value"
      (change)="params?.stopEditing()"
    />
  `,
  styleUrl: './ng-ag-grid-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridCalendarEditorComponent implements ICellEditorAngularComp {
  value = '';
  params?: ICellEditorParams;
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.value = this.toDateInputValue(params.value);
  }

  afterGuiAttached(): void {
    queueMicrotask(() => this.inputEl()?.nativeElement.focus());
  }

  getValue(): string {
    return this.value;
  }

  private toDateInputValue(value: unknown): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    const date = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
}
