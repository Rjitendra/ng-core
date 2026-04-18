import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgBadgeComponent } from '../badge/ng-badge.component';
import { IconComponent } from '../icon/ng-icon.component';

export type NgTileVariant = 'surface' | 'outlined' | 'accent';

@Component({
  selector: 'ng-tile',
  standalone: true,
  imports: [CommonModule, IconComponent, NgBadgeComponent],
  templateUrl: './ng-tile.component.html',
  styleUrl: './ng-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-tile-host',
    '[class.ng-tile--surface]': "variant() === 'surface'",
    '[class.ng-tile--outlined]': "variant() === 'outlined'",
    '[class.ng-tile--accent]': "variant() === 'accent'",
    '[class.ng-tile--interactive]': 'interactive()',
  },
})
export class NgTileComponent {
  readonly title = input<string>('Tile');
  readonly subtitle = input<string>();
  readonly description = input<string>();
  readonly icon = input<string>();
  readonly badge = input<string>();
  readonly metric = input<string>();
  readonly variant = input<NgTileVariant>('surface');
  readonly interactive = input<boolean>(false);
}
