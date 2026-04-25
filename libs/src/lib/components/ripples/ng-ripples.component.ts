import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'ng-ripples',
  standalone: true,
  imports: [CommonModule, MatRipple],
  template: `
    <section class="ng-ripples">
      <div class="ng-ripples__copy">
        <p class="ng-ripples__eyebrow">{{ eyebrow() }}</p>
        <h3>{{ title() }}</h3>
        <p>{{ description() }}</p>
      </div>
      <button
        type="button"
        class="ng-ripples__surface"
        matRipple
        [matRippleColor]="color()"
        [matRippleCentered]="centered()"
        [matRippleRadius]="radius()"
        [matRippleDisabled]="disabled()"
        [matRippleUnbounded]="unbounded()"
        (click)="surfacePressed.emit()"
      >
        <span>Tap to preview interaction polish</span>
        <small>{{ caption() }}</small>
      </button>
    </section>
  `,
  styles: [`
    .ng-ripples { display:grid; gap:18px; padding:24px; border-radius:28px; background:#0f172a; color:white; }
    .ng-ripples__copy { display:grid; gap:8px; }
    .ng-ripples__eyebrow { margin:0; color:#38bdf8; font-size:.75rem; letter-spacing:.14em; text-transform:uppercase; }
    .ng-ripples__copy h3, .ng-ripples__copy p { margin:0; }
    .ng-ripples__copy p:last-child { color:#cbd5e1; }
    .ng-ripples__surface {
      display:grid; gap:6px; justify-items:start; padding:28px; border:none; border-radius:24px; cursor:pointer;
      background:radial-gradient(circle at top left, #1d4ed8, #0f172a 72%); color:white;
    }
    .ng-ripples__surface small { color:#93c5fd; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgRipplesComponent {
  readonly eyebrow = input('Interaction detail');
  readonly title = input('Ripple surface');
  readonly description = input('Use elevated, branded ripple feedback instead of plain material defaults.');
  readonly caption = input('Centered, high-contrast feedback works well on glassy action surfaces.');
  readonly color = input('rgba(125, 211, 252, 0.35)');
  readonly centered = input(false);
  readonly radius = input(220);
  readonly disabled = input(false);
  readonly unbounded = input(false);

  readonly surfacePressed = output<void>();
}
