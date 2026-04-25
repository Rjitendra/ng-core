import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'ng-timepicker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <section class="ng-timepicker">
      <p>{{ eyebrow() }}</p>
      <mat-form-field appearance="outline" class="ng-timepicker__field">
        <mat-label>{{ label() }}</mat-label>
        <input
          matInput
          [matTimepicker]="picker"
          [ngModel]="value()"
          (ngModelChange)="updateValue($event)"
          [placeholder]="placeholder()"
          [min]="min()"
          [max]="max()"
        />
        <mat-timepicker-toggle matSuffix [for]="picker"></mat-timepicker-toggle>
        <mat-timepicker #picker [interval]="interval()"></mat-timepicker>
        @if (hint()) {
          <mat-hint>{{ hint() }}</mat-hint>
        }
      </mat-form-field>
    </section>
  `,
  styles: [`
    .ng-timepicker { display:grid; gap:12px; padding:20px; border-radius:24px; background:white; border:1px solid #e2e8f0; }
    .ng-timepicker > p { margin:0; color:#2563eb; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-timepicker__field { width:min(340px, 100%); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgTimepickerComponent {
  readonly eyebrow = input('Schedule controls');
  readonly label = input('Choose a time');
  readonly placeholder = input('Select a time');
  readonly hint = input('Optimized for concierge bookings, delivery windows, and appointment flows.');
  readonly interval = input<string | number>(15);
  readonly min = input<Date | null>(null);
  readonly max = input<Date | null>(null);

  readonly timeChanged = output<Date | null>();
  readonly value = signal<Date | null>(new Date(2026, 3, 25, 9, 30));

  updateValue(value: Date | null) {
    this.value.set(value);
    this.timeChanged.emit(value);
  }
}
