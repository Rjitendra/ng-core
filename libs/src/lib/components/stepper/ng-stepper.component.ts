import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

export interface StepConfig {
  label: string;
  completed?: boolean;
  editable?: boolean;
  optional?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  content?: TemplateRef<unknown>;
  data?: unknown;
}

@Component({
  selector: 'ng-stepper',
  standalone: true,
  imports: [CommonModule, MatStepperModule, MatButtonModule, MatIconModule],
  templateUrl: './ng-stepper.component.html',
  styleUrl: './ng-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgStepperComponent {
  private readonly fallbackStepControls: Record<number, AbstractControl> = {};

  readonly steps = input<StepConfig[]>([]);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly linear = input(false);
  readonly labelPosition = input<'bottom' | 'end'>('end');
  readonly showNavigation = input(true);
  readonly nextText = input('Next');
  readonly backText = input('Back');
  readonly completeText = input('Complete');
  readonly stepControls = input<AbstractControl[]>([]);

  readonly selectionChange = output<StepperSelectionEvent>();
  readonly stepCompleted = output<{ step: StepConfig; index: number }>();
  readonly stepperCompleted = output<void>();

  private readonly stepper = viewChild.required<MatStepper>(MatStepper);

  onSelectionChange(event: StepperSelectionEvent) {
    this.selectionChange.emit(event);
  }

  goForward(): void {
    const stepper = this.stepper();
    this.markStepCompleted(stepper.selectedIndex);
    stepper.next();
  }

  goBack(): void {
    this.stepper().previous();
  }

  complete(): void {
    const stepper = this.stepper();
    this.markStepCompleted(stepper.selectedIndex);
    this.stepperCompleted.emit();
  }

  private markStepCompleted(index: number) {
    const steps = this.steps();
    if (steps[index]) {
      steps[index].completed = true;
      this.stepCompleted.emit({ step: steps[index], index });
    }
  }

  next(): void {
    this.goForward();
  }

  previous(): void {
    this.goBack();
  }

  reset(): void {
    this.stepper().reset();
    this.steps().forEach((step) => {
      step.completed = false;
      step.hasError = false;
    });
  }

  goToStep(index: number): void {
    this.stepper().selectedIndex = index;
  }

  stepControlAt(index: number): AbstractControl {
    const controls = this.stepControls();
    const existing = controls[index];
    if (existing) {
      return existing;
    }
    if (!this.fallbackStepControls[index]) {
      this.fallbackStepControls[index] = new FormControl(null);
    }
    return this.fallbackStepControls[index];
  }
}
