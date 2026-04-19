import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/ng-button.component';
import { NgCardComponent } from '../card/ng-card.component';
import { NgDividerComponent } from '../divider/ng-divider.component';
import { IconComponent } from '../icon/ng-icon.component';

export interface NgAdvancedCardAction {
  label: string;
  icon?: string;
  type?: 'primary' | 'secondary' | 'danger';
  action: string;
}

@Component({
  selector: 'ng-advanced-card',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NgCardComponent,
    ButtonComponent,
    IconComponent,
    NgDividerComponent,
  ],
  templateUrl: './ng-advanced-card.component.html',
  styleUrl: './ng-advanced-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAdvancedCardComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly headerIcon = input<string>();
  /** Maps to {@link NgCardComponent} `variant`: `raised` → `elevated` */
  readonly appearance = input<'raised' | 'outlined'>('raised');

  readonly actions = input<NgAdvancedCardAction[]>([]);
  readonly actionClick = output<NgAdvancedCardAction>();

  readonly showFooter = input(false);
  readonly footerIcon = input<string>();
  readonly footerText = input<string>();
  readonly showTimestamp = input(false);
  readonly timestamp = input<Date>();

  cardVariant() {
    return this.appearance() === 'raised' ? 'elevated' : 'outlined';
  }

  onActionClick(action: NgAdvancedCardAction) {
    this.actionClick.emit(action);
  }

  buttonVariant(actionType?: string) {
    switch (actionType) {
      case 'primary':
        return 'filled' as const;
      case 'secondary':
        return 'outlined' as const;
      case 'danger':
        return 'text' as const;
      default:
        return 'text' as const;
    }
  }
}
