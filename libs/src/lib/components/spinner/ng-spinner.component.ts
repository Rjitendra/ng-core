import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type SpinnerVariant = 'circular' | 'dots' | 'pulse';
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'neutral' | 'light' | 'success' | 'danger';
export type SpinnerMode = 'indeterminate' | 'determinate';

@Component({
  selector: 'ng-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './ng-spinner.component.html',
  styleUrl: './ng-spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-spinner-host',
    '[class.ng-spinner--inline]': 'inline()',
    '[class.ng-spinner--block]': '!inline()',
    '[class.ng-spinner--xs]': "size() === 'xs'",
    '[class.ng-spinner--sm]': "size() === 'sm'",
    '[class.ng-spinner--md]': "size() === 'md'",
    '[class.ng-spinner--lg]': "size() === 'lg'",
    '[class.ng-spinner--xl]': "size() === 'xl'",
    '[class.ng-spinner--primary]': "color() === 'primary'",
    '[class.ng-spinner--neutral]': "color() === 'neutral'",
    '[class.ng-spinner--light]': "color() === 'light'",
    '[class.ng-spinner--success]': "color() === 'success'",
    '[class.ng-spinner--danger]': "color() === 'danger'",
  },
})
export class SpinnerComponent {
  readonly variant = input<SpinnerVariant>('circular');
  readonly size = input<SpinnerSize>('md');
  readonly color = input<SpinnerColor>('primary');
  readonly mode = input<SpinnerMode>('indeterminate');
  readonly progress = input<number>(35);
  readonly label = input<string>('Loading');
  readonly inline = input<boolean>(false);
  readonly overlay = input<boolean>(false);
  readonly strokeWidth = input<number>(4);

  normalizedProgress() {
    return Math.min(100, Math.max(0, this.progress()));
  }
}
