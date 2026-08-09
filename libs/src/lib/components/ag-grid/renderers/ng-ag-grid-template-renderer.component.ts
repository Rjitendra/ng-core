import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';
import { AgGridRow, NgAgGridComponent } from '../ng-ag-grid.component';

@Component({
  selector: 'ng-ag-grid-template-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (template) {
      <ng-container
        *ngTemplateOutlet="template; context: templateContext"
      ></ng-container>
    } @else {
      {{ value }}
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAgGridTemplateRendererComponent
  implements ICellRendererAngularComp
{
  value: unknown;
  template: TemplateRef<unknown> | null = null;
  templateContext: Record<string, unknown> = {};

  agInit(params: ICellRendererParams<AgGridRow>): void {
    this.setParams(params);
  }

  refresh(params: ICellRendererParams<AgGridRow>): boolean {
    this.setParams(params);
    return true;
  }

  private setParams(params: ICellRendererParams<AgGridRow>): void {
    const grid = params.context?.ngAgGrid as NgAgGridComponent | undefined;
    const templateKey =
      (params.colDef.cellRendererParams as { templateKey?: string } | undefined)
        ?.templateKey ?? params.colDef.field;

    this.value = params.value;
    this.template = grid?.getCellTemplate(templateKey) ?? null;
    this.templateContext = {
      $implicit: params.value,
      value: params.value,
      row: params.data,
      data: params.data,
      params,
    };
  }
}
