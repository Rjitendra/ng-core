import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent } from '../button/ng-button.component';
import { IconComponent } from '../icon/ng-icon.component';

export type NgCardVariant = 'elevated' | 'outlined' | 'ghost';

@Component({
  selector: 'ng-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, IconComponent, ButtonComponent],
  templateUrl: './ng-card.component.html',
  styleUrl: './ng-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-card-host',
    '[class.ng-card--elevated]': "variant() === 'elevated'",
    '[class.ng-card--outlined]': "variant() === 'outlined'",
    '[class.ng-card--ghost]': "variant() === 'ghost'",
    '[class.ng-card--interactive]': 'interactive()',
  },
})
export class NgCardComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly eyebrow = input<string>();
  readonly description = input<string>();
  readonly icon = input<string>();
  readonly image = input<string>();
  readonly imageAlt = input<string>('Card image');
  readonly badge = input<string>();
  readonly variant = input<NgCardVariant>('elevated');
  readonly interactive = input<boolean>(false);
}
