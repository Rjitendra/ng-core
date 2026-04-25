import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ButtonComponent } from '../button/ng-button.component';

export interface NgToolbarAction {
  label: string;
  icon?: string;
  type?: 'text' | 'outlined' | 'filled' | 'tonal';
  value: string;
}

@Component({
  selector: 'ng-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, ButtonComponent],
  template: `
    <mat-toolbar class="ng-toolbar">
      <div class="ng-toolbar__brand">
        <p>{{ eyebrow() }}</p>
        <h3>{{ title() }}</h3>
      </div>
      <div class="ng-toolbar__actions">
        @for (action of actions(); track action.value) {
          <ng-button
            [label]="action.label"
            [icon]="action.icon"
            [type]="action.type ?? 'text'"
            (buttonClick)="actionClicked.emit(action.value)"
          ></ng-button>
        }
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .ng-toolbar {
      display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap;
      min-height:unset; padding:18px 20px; border-radius:22px;
      background:linear-gradient(90deg, #111827, #1d4ed8); color:white;
    }
    .ng-toolbar__brand { display:grid; gap:4px; }
    .ng-toolbar__brand p, .ng-toolbar__brand h3 { margin:0; }
    .ng-toolbar__brand p { color:#93c5fd; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-toolbar__actions { display:flex; gap:10px; flex-wrap:wrap; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgToolbarComponent {
  readonly eyebrow = input('Workspace shell');
  readonly title = input('Premium toolbar');
  readonly actions = input<NgToolbarAction[]>([
    { value: 'share', label: 'Share', icon: 'share', type: 'text' },
    { value: 'preview', label: 'Preview', icon: 'visibility', type: 'outlined' },
    { value: 'publish', label: 'Publish', icon: 'rocket_launch', type: 'filled' },
  ]);

  readonly actionClicked = output<string>();
}
