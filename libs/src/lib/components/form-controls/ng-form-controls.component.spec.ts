import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { NgCheckboxComponent } from '../checkbox/ng-checkbox.component';
import { NgRadioGroupComponent } from '../radio/ng-radio-group.component';
import { NgTextboxComponent } from '../textbox/ng-textbox.component';
import { NgToggleComponent } from '../toggle/ng-toggle.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgTextboxComponent,
    NgCheckboxComponent,
    NgToggleComponent,
    NgRadioGroupComponent,
  ],
  template: `
    <form [formGroup]="form">
      <ng-textbox formControlName="name"></ng-textbox>
      <ng-checkbox formControlName="agree" label="Agree"></ng-checkbox>
      <ng-toggle formControlName="enabled" label="Enabled"></ng-toggle>
      <ng-radio-group formControlName="plan" [options]="options"></ng-radio-group>
    </form>
  `,
})
class ReactiveHostComponent {
  readonly options = [
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro' },
  ];

  readonly form = new FormGroup({
    name: new FormControl('Atlas'),
    agree: new FormControl(true, { nonNullable: true }),
    enabled: new FormControl(false, { nonNullable: true }),
    plan: new FormControl('pro'),
  });
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgTextboxComponent,
    NgCheckboxComponent,
    NgToggleComponent,
    NgRadioGroupComponent,
  ],
  template: `
    <ng-textbox [(ngModel)]="name" name="name"></ng-textbox>
    <ng-checkbox [(ngModel)]="agree" name="agree" label="Agree"></ng-checkbox>
    <ng-toggle [(ngModel)]="enabled" name="enabled" label="Enabled"></ng-toggle>
    <ng-radio-group [(ngModel)]="plan" name="plan" [options]="options"></ng-radio-group>
  `,
})
class TemplateHostComponent {
  name = 'Jordan';
  agree = false;
  enabled = true;
  plan = 'basic';
  readonly options = [
    { value: 'basic', label: 'Basic' },
    { value: 'pro', label: 'Pro' },
  ];
}

describe('Form controls integration', () => {
  it('binds with reactive forms', async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ReactiveHostComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.form.value).toEqual({
      name: 'Atlas',
      agree: true,
      enabled: false,
      plan: 'pro',
    });

    component.form.patchValue({
      name: 'Nova',
      agree: false,
      enabled: true,
      plan: 'basic',
    });
    fixture.detectChanges();

    const textInput = fixture.nativeElement.querySelector('input[matinput]') as HTMLInputElement;
    expect(textInput.value).toBe('Nova');
  });

  it('binds with template-driven forms', async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateHostComponent],
    }).compileComponents();

    const fixture: ComponentFixture<TemplateHostComponent> = TestBed.createComponent(TemplateHostComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.name).toBe('Jordan');
    expect(component.agree).toBe(false);
    expect(component.enabled).toBe(true);
    expect(component.plan).toBe('basic');
  });
});
