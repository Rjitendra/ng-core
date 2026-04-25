import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgChipsComponent } from './ng-chips.component';

const chipItems = [
  { id: 'angular', label: 'Angular' },
  { id: 'react', label: 'React' },
  { id: 'vue', label: 'Vue' },
  { id: 'svelte', label: 'Svelte', removable: false },
];

@Component({
  selector: 'storybook-chips-reactive',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedControlsModule],
  template: `
    <div style="display:grid; gap:16px; width:min(700px, 100%);">
      <ng-chips [items]="items" [formControl]="control"></ng-chips>
      <pre
        style="margin:0; padding:14px; border-radius:16px; background:#f8fafc;"
        >{{ control.value | json }}</pre
      >
    </div>
  `,
})
class StorybookChipsReactiveComponent {
  readonly items = chipItems;
  readonly control = new FormControl(['angular', 'vue']);
}

const meta: Meta<NgChipsComponent> = {
  title: 'Controls/Chips',
  component: NgChipsComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [SharedControlsModule, FormsModule] }),
  ],
  args: {
    items: chipItems,
    selectable: true,
    multiple: true,
    removable: true,
  },
};

export default meta;
type Story = StoryObj<NgChipsComponent>;
export const Default: Story = {};
export const SingleSelect: Story = {
  args: { multiple: false },
};
export const ReactiveForms: Story = {
  render: () => ({
    moduleMetadata: { imports: [StorybookChipsReactiveComponent] },
    template: `<storybook-chips-reactive></storybook-chips-reactive>`,
  }),
};
