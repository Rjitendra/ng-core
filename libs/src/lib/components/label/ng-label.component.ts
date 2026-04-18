import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ng-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ng-label.component.html',
  styleUrl: './ng-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgLabelComponent {
  readonly text = input<string>('');
  readonly forId = input<string>();
  readonly hint = input<string>();
  readonly required = input<boolean>(false);
  readonly optional = input<boolean>(false);
}
