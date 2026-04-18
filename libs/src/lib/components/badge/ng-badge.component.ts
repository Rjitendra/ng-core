import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/ng-icon.component';

export type NgBadgeVariant =
  | 'primary'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger';
export type NgBadgeStyle = 'filled' | 'soft' | 'outline';
export type NgBadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ng-badge',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './ng-badge.component.html',
  styleUrl: './ng-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-badge-host',
    '[class.ng-badge--primary]': "variant() === 'primary'",
    '[class.ng-badge--neutral]': "variant() === 'neutral'",
    '[class.ng-badge--success]': "variant() === 'success'",
    '[class.ng-badge--warning]': "variant() === 'warning'",
    '[class.ng-badge--danger]': "variant() === 'danger'",
    '[class.ng-badge--filled]': "styleType() === 'filled'",
    '[class.ng-badge--soft]': "styleType() === 'soft'",
    '[class.ng-badge--outline]': "styleType() === 'outline'",
    '[class.ng-badge--sm]': "size() === 'sm'",
    '[class.ng-badge--md]': "size() === 'md'",
    '[class.ng-badge--lg]': "size() === 'lg'",
    '[class.ng-badge--pill]': 'pill()',
  },
})
export class NgBadgeComponent {
  readonly text = input<string>('Badge');
  readonly icon = input<string>();
  readonly variant = input<NgBadgeVariant>('primary');
  readonly styleType = input<NgBadgeStyle>('soft');
  readonly size = input<NgBadgeSize>('md');
  readonly pill = input<boolean>(true);
}
