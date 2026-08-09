import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-enterprise';

@Component({
  selector: 'ng-ag-grid-checkbox-editor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="ng-ag-grid-checkbox-editor">
      <input
        type="checkbox"
        [checked]="value"
        (change)="value = checkbox.checked"
        #checkbox
      />
      <span>{{ value ? 'Yes' : 'No' }}</span>
    </label>
  `,
  styleUrl: './ng-ag-grid-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridCheckboxEditorComponent implements ICellEditorAngularComp {
  value = false;

  agInit(params: ICellEditorParams): void {
    this.value = this.coerceBoolean(params.value);
  }

  getValue(): boolean {
    return this.value;
  }

  private coerceBoolean(value: unknown): boolean {
    return value === true || value === 'true' || value === 1 || value === '1';
  }
}
