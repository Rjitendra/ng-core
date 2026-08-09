import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { AgGridRow, NgAgGridComponent } from '../ng-ag-grid.component';

@Component({
  selector: 'ng-ag-grid-action-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (canShowActions) {
      <div class="ng-ag-grid-row-actions">
        @if (isEditing) {
          <button type="button" title="Save row" (click)="save()">✓</button>
          <button type="button" title="Cancel edit" (click)="cancel()">×</button>
        } @else {
          <button type="button" title="Edit row" (click)="edit()">✎</button>
        }
      </div>
    }
  `,
  styles: [
    `
      .ng-ag-grid-row-actions {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 100%;
      }

      button {
        width: 28px;
        height: 28px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        color: #0f172a;
        background: #ffffff;
        font: inherit;
        font-size: 14px;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
      }

      button:hover {
        border-color: #2563eb;
        color: #1d4ed8;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridActionRendererComponent implements ICellRendererAngularComp {
  params?: ICellRendererParams<AgGridRow>;
  grid?: NgAgGridComponent;
  isEditing = false;
  canShowActions = true;

  agInit(params: ICellRendererParams<AgGridRow>): void {
    this.params = params;
    this.grid = params.context?.ngAgGrid as NgAgGridComponent | undefined;
    this.syncState();
  }

  refresh(params: ICellRendererParams<AgGridRow>): boolean {
    this.params = params;
    this.syncState();
    return true;
  }

  edit(): void {
    if (this.params?.data) {
      this.grid?.startRowEdit(this.params.data);
    }
  }

  save(): void {
    this.grid?.stopRowEdit(false);
  }

  cancel(): void {
    this.grid?.cancelRowEdit();
  }

  private syncState(): void {
    const data = this.params?.data;
    this.isEditing = !!data && !!this.grid?.isRowEditing(data);
    this.canShowActions =
      !!data && (!this.grid?.hasActiveRowEdit() || this.isEditing);
  }
}
