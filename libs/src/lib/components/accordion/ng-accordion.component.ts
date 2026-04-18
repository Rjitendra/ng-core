import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { IconComponent } from '../icon/ng-icon.component';

export interface NgAccordionItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'ng-accordion',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, IconComponent],
  templateUrl: './ng-accordion.component.html',
  styleUrl: './ng-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgAccordionComponent {
  readonly items = input<NgAccordionItem[]>([]);
  readonly multi = input<boolean>(false);
  readonly hideToggle = input<boolean>(false);
  readonly displayMode = input<'default' | 'flat'>('default');
}
