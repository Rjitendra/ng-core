import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedControlsModule } from '../../shared-controls.module';
import { NgLayoutComponent } from './ng-layout.component';

@Component({
  standalone: true,
  template: `<p style="padding:16px;"> Routed placeholder content </p>`,
})
class StoryPlaceholderComponent {}

const routes: Routes = [{ path: '', component: StoryPlaceholderComponent }];

const meta: Meta<NgLayoutComponent> = {
  title: 'Shared/Layout',
  component: NgLayoutComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        SharedControlsModule,
        RouterTestingModule.withRoutes(routes),
        StoryPlaceholderComponent,
      ],
    }),
  ],
  parameters: { layout: 'fullscreen' },
  args: {
    brandTitle: 'ng-core',
    welcomeTitle: 'Storybook shell',
    versionLabel: 'dev',
    footerNote: `© ${new Date().getFullYear()} Demo`,
    navItems: [],
  },
};

export default meta;
type Story = StoryObj<NgLayoutComponent>;

export const ShellWithoutNav: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ng-layout
        [brandTitle]="brandTitle"
        [welcomeTitle]="welcomeTitle"
        [versionLabel]="versionLabel"
        [footerNote]="footerNote"
        [navItems]="navItems"
      />
    `,
  }),
};
