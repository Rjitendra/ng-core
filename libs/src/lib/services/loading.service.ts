import { Injectable, computed, signal } from '@angular/core';
import {
  SpinnerColor,
  SpinnerMode,
  SpinnerSize,
  SpinnerVariant,
} from '../components/spinner/ng-spinner.component';

export interface LoadingSpinnerOptions {
  key?: string;
  label?: string;
  variant?: SpinnerVariant;
  size?: SpinnerSize;
  color?: SpinnerColor;
  mode?: SpinnerMode;
  progress?: number;
  inline?: boolean;
  overlay?: boolean;
  strokeWidth?: number;
  backdropClass?: string;
  panelClass?: string;
}

export interface LoadingSpinnerState extends LoadingSpinnerOptions {
  key: string;
  active: boolean;
}

interface LoadingTracker {
  count: number;
  state: LoadingSpinnerState;
}

const DEFAULT_LOADING_STATE: LoadingSpinnerState = {
  key: 'global',
  active: true,
  label: 'Loading',
  variant: 'circular',
  size: 'md',
  color: 'primary',
  mode: 'indeterminate',
  progress: 35,
  inline: false,
  overlay: true,
  strokeWidth: 4,
  backdropClass: '',
  panelClass: '',
};

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly trackers = signal<Record<string, LoadingTracker>>({});

  readonly activeSpinners = computed(() =>
    Object.values(this.trackers())
      .filter((tracker) => tracker.count > 0)
      .map((tracker) => tracker.state)
  );

  readonly isLoading = computed(() => this.activeSpinners().length > 0);
  readonly primarySpinner = computed(() => {
    const spinners = this.activeSpinners();
    return spinners.length ? spinners[spinners.length - 1] : null;
  });

  show(options: LoadingSpinnerOptions = {}) {
    const key = options.key ?? 'global';

    this.trackers.update((current) => {
      const existing = current[key];
      const nextState: LoadingSpinnerState = {
        ...(existing?.state ?? DEFAULT_LOADING_STATE),
        ...options,
        key,
        active: true,
      };

      return {
        ...current,
        [key]: {
          count: (existing?.count ?? 0) + 1,
          state: nextState,
        },
      };
    });

    return key;
  }

  hide(key = 'global') {
    this.trackers.update((current) => {
      const existing = current[key];
      if (!existing) {
        return current;
      }

      const nextCount = existing.count - 1;
      if (nextCount > 0) {
        return {
          ...current,
          [key]: {
            ...existing,
            count: nextCount,
          },
        };
      }

      const { [key]: _, ...rest } = current;
      return rest;
    });
  }

  clear(key?: string) {
    if (!key) {
      this.trackers.set({});
      return;
    }

    this.trackers.update((current) => {
      const { [key]: _, ...rest } = current;
      return rest;
    });
  }
}
