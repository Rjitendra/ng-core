import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressBarModule, ProgressBarMode } from '@angular/material/progress-bar';

export type ProgressBarVariant = 'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type ProgressBarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ng-progress-bar',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './ng-progress-bar.component.html',
  styleUrl: './ng-progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-progress-bar-host',
    '[class.ng-progress-bar--sm]': "size() === 'sm'",
    '[class.ng-progress-bar--md]': "size() === 'md'",
    '[class.ng-progress-bar--lg]': "size() === 'lg'",
    '[class.ng-progress-bar--primary]': "variant() === 'primary'",
    '[class.ng-progress-bar--neutral]': "variant() === 'neutral'",
    '[class.ng-progress-bar--success]': "variant() === 'success'",
    '[class.ng-progress-bar--warning]': "variant() === 'warning'",
    '[class.ng-progress-bar--danger]': "variant() === 'danger'",
    '[class.ng-progress-bar--inline]': 'inline()',
  },
})
export class NgProgressBarComponent {
  readonly label = input<string>();
  readonly caption = input<string>();
  readonly mode = input<ProgressBarMode>('determinate');
  readonly value = input<number>(0);
  readonly bufferValue = input<number>(0);
  readonly variant = input<ProgressBarVariant>('primary');
  readonly size = input<ProgressBarSize>('md');
  readonly inline = input<boolean>(false);
  readonly showValue = input<boolean>(true);
  readonly animated = input<boolean>(false);

  readonly normalizedValue = computed(() =>
    Math.max(0, Math.min(100, this.value()))
  );
  readonly normalizedBufferValue = computed(() =>
    Math.max(0, Math.min(100, this.bufferValue()))
  );
  readonly displayValue = computed(() => `${Math.round(this.normalizedValue())}%`);
}
