import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import type { Meta, StoryObj } from '@storybook/angular';
import { withControlDocs } from '../../storybook/standalone-docs';
import { moduleMetadata } from '@storybook/angular';
import { NgLayoutComponent } from './ng-layout.component';

@Component({
  standalone: true,
  template: `<p style="padding:16px;">Routed placeholder content</p>`,
})
class StoryPlaceholderComponent {}

const routes: Routes = [{ path: '', component: StoryPlaceholderComponent }];

const meta: Meta<NgLayoutComponent> = {
  title: 'Layout/Layout',
  component: NgLayoutComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        NgLayoutComponent,
        RouterTestingModule.withRoutes(routes),
        StoryPlaceholderComponent,
      ],
    }),
  ],
  parameters: withControlDocs(NgLayoutComponent, { layout: 'fullscreen' }),
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
