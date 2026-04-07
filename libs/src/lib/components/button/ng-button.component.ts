import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

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

@Component({
  selector: 'ng-button',
  standalone: false,
  templateUrl: './ng-button.component.html',
  styleUrl: './ng-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly type = input<ButtonVariant>('text');
  readonly label = input<string>('Button');
  readonly icon = input<string>();
  readonly disabled = input<boolean>(false);
  readonly href = input<string>();
  readonly tooltip = input<string>();
  readonly cssClass = input<string>();
  readonly buttonType = input<'button' | 'submit' | 'reset'>('button');

  readonly buttonClick = output<void>();

  onClick() {
    if (!this.disabled() && this.buttonType() !== 'submit') {
      this.buttonClick.emit();
    }
  }
}
