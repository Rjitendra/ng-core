import { ConnectionPositionPair, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgMenuComponent } from './ng-menu.component';

@Directive({
  selector: '[ngMenuTriggerFor]',
  standalone: true,
})
export class NgMenuTriggerForDirective implements OnDestroy {
  readonly ngMenuTriggerFor = input.required<NgMenuComponent>();

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private overlayRef?: OverlayRef;
  private readonly subscription = new Subscription();

  @HostListener('click')
  onClick() {
    const menu = this.ngMenuTriggerFor();
    if (menu.menuTemplate()) {
      this.openMenu(menu);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.overlayRef?.dispose();
  }

  private openMenu(menu: NgMenuComponent) {
    if (this.overlayRef?.hasAttached()) {
      return;
    }

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.getPositions());

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const portal = new TemplatePortal(menu.menuTemplate(), menu.viewContainerRef);
    this.overlayRef.attach(portal);

    this.subscription.add(
      this.overlayRef.backdropClick().subscribe(() => {
        this.overlayRef?.detach();
      }),
    );
  }

  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
    ];
  }
}
