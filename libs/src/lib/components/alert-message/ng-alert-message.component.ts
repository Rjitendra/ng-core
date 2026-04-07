import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent, ButtonVariant } from '../button/ng-button.component';
import { IconComponent } from '../icon/ng-icon.component';
import { MessageButton } from '../../models/alert';

@Component({
  selector: 'ng-alert-message',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  templateUrl: './ng-alert-message.component.html',
  styleUrl: './ng-alert-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-alert-message-host',
    '[class.ng-alert-message--success]': "alertType() === 'success'",
    '[class.ng-alert-message--error]': "alertType() === 'error'",
    '[class.ng-alert-message--info]': "alertType() === 'info'",
    '[class.ng-alert-message--warning]': "alertType() === 'warning'",
  },
})
export class AlertMessageComponent {
  readonly alertType = input<'success' | 'error' | 'info' | 'warning'>('info');
  readonly buttons = input<MessageButton[]>([]);
  readonly id = input<number>(0);
  readonly messageText = input<string>('');
  readonly hideCloseButton = input<boolean>(false);
  readonly clearAlert = output<number>();

  messageLines(): string[] {
    return this.messageText()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  heading(): string {
    return this.messageLines()[0] ?? '';
  }

  detailLines(): string[] {
    return this.messageLines().slice(1);
  }

  iconName(): string {
    switch (this.alertType()) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  onCloseAlert(id: number): void {
    this.clearAlert.emit(id);
  }

  buttonVariant(button: MessageButton): ButtonVariant {
    switch (button.buttonType) {
      case 'primary':
        return 'filled';
      case 'secondary':
        return 'outlined';
      case 'tertiary':
        return 'tonal';
      case 'danger':
        return 'filled';
      case 'link':
      case 'text':
      default:
        return 'text';
    }
  }

  buttonIconTone(button: MessageButton) {
    return button.buttonType === 'danger' ? 'danger' : 'inherit';
  }
}
