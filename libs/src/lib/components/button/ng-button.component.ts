import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../icon/ng-icon.component';
import { SpinnerComponent } from '../spinner/ng-spinner.component';

export type ButtonVariant =
  | 'text'
  | 'elevated'
  | 'outlined'
  | 'filled'
  | 'tonal'
  | 'icon'
  | 'fab'
  | 'mini-fab'
  | 'extended';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonIconPosition = 'start' | 'end';

@Component({
  selector: 'ng-button',
  standalone: true,
  imports: [MatButtonModule, MatTooltipModule, IconComponent, SpinnerComponent],
  templateUrl: './ng-button.component.html',
  styleUrl: './ng-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly type = input<ButtonVariant>('text');
  readonly label = input<string>('Button');
  readonly icon = input<string>();
  readonly iconPosition = input<ButtonIconPosition>('start');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly href = input<string>();
  readonly target = input<'_self' | '_blank' | '_parent' | '_top'>('_self');
  readonly rel = input<string>();
  readonly tooltip = input<string>();
  readonly cssClass = input<string>();
  readonly buttonType = input<'button' | 'submit' | 'reset'>('button');
  readonly iconTone = input<'inherit' | 'primary' | 'muted' | 'success' | 'danger' | 'warning' | 'light'>('inherit');

  readonly buttonClick = output<void>();

  resolvedRel() {
    if (this.rel()) {
      return this.rel();
    }

    return this.target() === '_blank' ? 'noopener noreferrer' : null;
  }

  isDisabled() {
    return this.disabled() || this.loading();
  }

  showLeadingIcon() {
    return this.icon() && this.iconPosition() === 'start' && !this.loading();
  }

  showTrailingIcon() {
    return this.icon() && this.iconPosition() === 'end' && !this.loading();
  }

  iconToneForVariant() {
    if (this.iconTone() !== 'inherit') {
      return this.iconTone();
    }

    return this.type() === 'filled' || this.type() === 'fab' || this.type() === 'mini-fab' || this.type() === 'extended'
      ? 'light'
      : 'inherit';
  }

  onClick() {
    if (!this.isDisabled() && this.buttonType() !== 'submit') {
      this.buttonClick.emit();
    }
  }
}
