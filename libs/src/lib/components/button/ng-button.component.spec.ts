import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './ng-button.component';
import { SharedControlsModule } from '../../shared-controls.module';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedControlsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit click when enabled', () => {
    const emitSpy = vi.spyOn(component.buttonClick, 'emit');

    component.onClick();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit click when loading', () => {
    const emitSpy = vi.spyOn(component.buttonClick, 'emit');
    fixture.componentRef.setInput('loading', true);

    component.onClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should default rel for blank targets', () => {
    fixture.componentRef.setInput('target', '_blank');

    expect(component.resolvedRel()).toBe('noopener noreferrer');
  });
});
