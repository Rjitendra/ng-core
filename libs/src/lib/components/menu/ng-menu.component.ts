import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'ng-menu',
  standalone: true,
  imports: [CommonModule],
  exportAs: 'ngMenu',
  template: `
    <ng-template #menuTemplate>
      <div class="ng-menu-panel" [ngClass]="panelClass()">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgMenuComponent {
  readonly panelClass = input('');

  private readonly menuTpl = viewChild.required<TemplateRef<unknown>>('menuTemplate');

  constructor(public viewContainerRef: ViewContainerRef) {}

  /** Template used by {@link NgMenuTriggerForDirective} */
  menuTemplate() {
    return this.menuTpl();
  }
}
