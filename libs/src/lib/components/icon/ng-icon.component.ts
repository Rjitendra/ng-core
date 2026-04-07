import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CUSTOM_ICON_REGISTRY, CustomIconName } from './ng-icon.registry';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconTone =
  | 'inherit'
  | 'primary'
  | 'muted'
  | 'success'
  | 'danger'
  | 'warning'
  | 'light';

@Component({
  selector: 'ng-icon',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './ng-icon.component.html',
  styleUrl: './ng-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-icon-host',
    '[class.ng-icon--xs]': "size() === 'xs'",
    '[class.ng-icon--sm]': "size() === 'sm'",
    '[class.ng-icon--md]': "size() === 'md'",
    '[class.ng-icon--lg]': "size() === 'lg'",
    '[class.ng-icon--xl]': "size() === 'xl'",
    '[class.ng-icon--inherit]': "tone() === 'inherit'",
    '[class.ng-icon--primary]': "tone() === 'primary'",
    '[class.ng-icon--muted]': "tone() === 'muted'",
    '[class.ng-icon--success]': "tone() === 'success'",
    '[class.ng-icon--danger]': "tone() === 'danger'",
    '[class.ng-icon--warning]': "tone() === 'warning'",
    '[class.ng-icon--light]': "tone() === 'light'",
    '[class.ng-icon--spin]': 'spin()',
  },
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input<string>();
  readonly customIcon = input<CustomIconName>();
  readonly svgIcon = input<string>();
  readonly fontSet = input<string>();
  readonly fontIcon = input<string>();
  readonly src = input<string>();
  readonly alt = input<string>('Icon');
  readonly size = input<IconSize>('md');
  readonly tone = input<IconTone>('inherit');
  readonly inline = input<boolean>(true);
  readonly spin = input<boolean>(false);
  readonly ariaLabel = input<string>();

  hasMaterialIcon() {
    return !!(this.name() || this.svgIcon() || this.fontIcon());
  }

  hasCustomRegistryIcon() {
    return !!this.customIcon();
  }

  hasImageIcon() {
    return !!this.src();
  }

  hasProjectedFallback() {
    return (
      !this.hasMaterialIcon() &&
      !this.hasCustomRegistryIcon() &&
      !this.hasImageIcon()
    );
  }

  resolvedCustomIcon(): SafeHtml | null {
    const key = this.customIcon();
    if (!key) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustHtml(CUSTOM_ICON_REGISTRY[key]);
  }

  resolvedFontSet() {
    return this.fontSet() ?? '';
  }

  resolvedFontIcon() {
    return this.fontIcon() ?? '';
  }

  resolvedSvgIcon() {
    return this.svgIcon() ?? '';
  }

  resolvedAriaHidden() {
    return this.ariaLabel() ? null : 'true';
  }
}
