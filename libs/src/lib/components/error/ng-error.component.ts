import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';

export type NgErrorValue = string | string[] | null | undefined;

@Component({
  selector: 'ng-error',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule],
  templateUrl: './ng-error.component.html',
  styleUrl: './ng-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgErrorComponent {
  readonly error = input<NgErrorValue>();
  readonly id = input<string>();

  readonly messages = computed(() => {
    const value = this.error();
    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value.filter(Boolean) : [value];
  });
}
