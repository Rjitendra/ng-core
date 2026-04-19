import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { MatButtonModule } from '@angular/material/button';
import { NgMenuComponent } from './ng-menu.component';
import { NgMenuItemDirective } from './ng-menu-item.directive';
import { NgMenuTriggerForDirective } from './ng-menu-trigger.directive';

@Component({
  selector: 'storybook-ng-menu-demo',
  standalone: true,
  imports: [MatButtonModule, NgMenuComponent, NgMenuItemDirective, NgMenuTriggerForDirective],
  template: `
    <button mat-stroked-button type="button" [ngMenuTriggerFor]="menu">Open menu</button>
    <ng-menu #menu="ngMenu">
      <div style="padding:12px 16px; min-width:200px;">
        <div ng-menu-item>First action</div>
        <div ng-menu-item>Second action</div>
      </div>
    </ng-menu>
  `,
})
class NgMenuStoryHostComponent {}

const meta: Meta<NgMenuStoryHostComponent> = {
  title: 'Shared/Menu',
  component: NgMenuStoryHostComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [NgMenuStoryHostComponent] })],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<NgMenuStoryHostComponent>;

export const OverlayMenu: Story = {
  render: () => ({
    template: `<storybook-ng-menu-demo />`,
    moduleMetadata: { imports: [NgMenuStoryHostComponent] },
  }),
};
