import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../spinner/ng-spinner.component';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'ng-loading-overlay',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './ng-loading-overlay.component.html',
  styleUrl: './ng-loading-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgLoadingOverlayComponent {
  private readonly loadingService = inject(LoadingService);

  readonly spinnerKey = input<string>();
  readonly fullscreen = input<boolean>(true);

  readonly spinner = computed(() => {
    const key = this.spinnerKey();
    if (!key) {
      return this.loadingService.primarySpinner();
    }

    return this.loadingService.activeSpinners().find((spinner) => spinner.key === key) ?? null;
  });
}
