import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { IconComponent } from '../icon/ng-icon.component';

export interface NgTabItem {
  label: string;
  subtitle?: string;
  icon?: string;
  content: string;
}

@Component({
  selector: 'ng-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, IconComponent],
  template: `
    <section class="ng-tabs">
      <p>{{ eyebrow() }}</p>
      <mat-tab-group [selectedIndex]="selectedIndex()" (selectedIndexChange)="tabChanged.emit($event)">
        @for (tab of tabs(); track tab.label) {
          <mat-tab>
            <ng-template mat-tab-label>
              @if (tab.icon) {
                <ng-icon [name]="tab.icon" size="sm"></ng-icon>
              }
              <span>{{ tab.label }}</span>
            </ng-template>
            <article class="ng-tabs__panel">
              <h3>{{ tab.label }}</h3>
              @if (tab.subtitle) {
                <small>{{ tab.subtitle }}</small>
              }
              <p>{{ tab.content }}</p>
            </article>
          </mat-tab>
        }
      </mat-tab-group>
    </section>
  `,
  styles: [`
    .ng-tabs { display:grid; gap:14px; padding:22px; border-radius:24px; background:linear-gradient(180deg, #fff, #f8fafc); border:1px solid #e2e8f0; }
    .ng-tabs > p { margin:0; color:#0284c7; font-size:.75rem; letter-spacing:.12em; text-transform:uppercase; }
    .ng-tabs__panel { display:grid; gap:8px; padding:20px 4px 4px; }
    .ng-tabs__panel h3, .ng-tabs__panel p, .ng-tabs__panel small { margin:0; }
    .ng-tabs__panel small { color:#6366f1; font-weight:600; }
    .ng-tabs__panel p { color:#475569; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgTabsComponent {
  readonly eyebrow = input('Segmented content');
  readonly selectedIndex = input(0);
  readonly tabs = input<NgTabItem[]>([
    { label: 'Overview', subtitle: 'Health and momentum', icon: 'insights', content: 'See growth signals, risk flags, and priority actions in one narrative view.' },
    { label: 'Notes', subtitle: 'Context for the team', icon: 'sticky_note_2', content: 'Capture implementation nuances, stakeholder context, and premium service details.' },
    { label: 'Timeline', subtitle: 'What happens next', icon: 'schedule', content: 'Map milestones, delivery dates, and executive updates with a cleaner information hierarchy.' },
  ]);

  readonly tabChanged = output<number>();
}
