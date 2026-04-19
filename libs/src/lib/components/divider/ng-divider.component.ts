import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'ng-divider',
  standalone: true,
  imports: [MatDividerModule],
  template: `
    <mat-divider [vertical]="vertical()" [inset]="inset()" [class]="cssClass()"></mat-divider>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgDividerComponent {
  readonly vertical = input(false);
  readonly inset = input(false);
  readonly cssClass = input('');
}
