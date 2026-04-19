import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { LayoutNavItem } from '../../models/layout-nav.model';
import { LayoutUserDetail } from '../../models/layout-user.model';
import { NgLoadingOverlayComponent } from '../loading-overlay/ng-loading-overlay.component';

@Component({
  selector: 'ng-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    NgLoadingOverlayComponent,
  ],
  templateUrl: './ng-layout.component.html',
  styleUrl: './ng-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgLayoutComponent implements AfterViewInit {
  readonly logIn = output<void>();
  readonly logOut = output<void>();
  readonly profileNavigate = output<void>();

  readonly user = input<LayoutUserDetail | null>(null);
  readonly brandTitle = input('Application');
  readonly welcomeTitle = input('Welcome');
  readonly versionLabel = input('');
  readonly footerNote = input(`© ${new Date().getFullYear()}`);

  readonly sidenav = viewChild.required<MatSidenav>('sidenav');
  readonly toggleButton = viewChild.required('toggleButton', {
    read: ElementRef,
  });
  readonly navItems = input<LayoutNavItem[]>([]);

  isExpanded = false;
  isRotated = false;

  ngAfterViewInit() {
    this.updateSidenavState();
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
    this.isRotated = !this.isRotated;
    this.updateSidenavState();
  }

  toggleSubMenu(item: LayoutNavItem) {
    if (item.expanded) {
      this.closeAllChildren(item);
    }
    item.expanded = !item.expanded;
  }

  private closeAllChildren(item: LayoutNavItem) {
    if (item.children) {
      item.children.forEach((child) => {
        child.expanded = false;
        this.closeAllChildren(child);
      });
    }
  }

  private updateSidenavState() {
    // Width is driven by CSS classes on the sidenav.
  }

  onLogin() {
    this.logIn.emit();
  }

  onLogout() {
    this.logOut.emit();
  }

  onProfile() {
    this.profileNavigate.emit();
  }
}
