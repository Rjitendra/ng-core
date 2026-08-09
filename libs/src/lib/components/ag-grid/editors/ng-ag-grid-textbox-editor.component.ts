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
  selector: 'ng-ag-grid-textbox-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <input
      #inputEl
      class="ng-ag-grid-editor ng-ag-grid-editor--text"
      [value]="value"
      [placeholder]="placeholder"
      (input)="value = inputEl.value"
      (keydown.enter)="params?.stopEditing()"
    />
  `,
  styleUrl: './ng-ag-grid-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridTextboxEditorComponent implements ICellEditorAngularComp {
  value = '';
  placeholder = '';
  params?: ICellEditorParams;
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.value = params.value == null ? '' : String(params.value);
    this.placeholder = String(
      params.colDef.headerName ?? params.colDef.field ?? '',
    );
  }

  afterGuiAttached(): void {
    queueMicrotask(() => {
      const element = this.inputEl()?.nativeElement;
      element?.focus();
      element?.select();
    });
  }

  getValue(): string {
    return this.value;
  }
}
