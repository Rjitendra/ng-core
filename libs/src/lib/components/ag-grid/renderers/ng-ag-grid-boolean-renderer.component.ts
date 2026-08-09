import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'ng-ag-grid-boolean-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ng-ag-grid-boolean" [class.ng-ag-grid-boolean--false]="!value">
      {{ value ? 'Yes' : 'No' }}
    </span>
  `,
  styles: [
    `
      .ng-ag-grid-boolean {
        display: inline-flex;
        align-items: center;
        height: 24px;
        padding: 0 8px;
        border-radius: 999px;
        color: #14532d;
        background: #dcfce7;
        font-size: 12px;
        font-weight: 600;
      }

      .ng-ag-grid-boolean--false {
        color: #7f1d1d;
        background: #fee2e2;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridBooleanRendererComponent
  implements ICellRendererAngularComp
{
  value = false;

  agInit(params: ICellRendererParams): void {
    this.value = this.coerceBoolean(params.value);
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = this.coerceBoolean(params.value);
    return true;
  }

  private coerceBoolean(value: unknown): boolean {
    return value === true || value === 'true' || value === 1 || value === '1';
  }
}
