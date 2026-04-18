import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../icon/ng-icon.component';

@Component({
  selector: 'ng-clarify-text',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, IconComponent],
  templateUrl: './ng-clarify-text.component.html',
  styleUrl: './ng-clarify-text.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgClarifyTextComponent {
  readonly clarifyText = input<string>('');
  readonly label = input<string>('Why?');
  readonly icon = input<string>('help');
}
