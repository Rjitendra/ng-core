import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconComponent } from './ng-icon.component';

describe('IconComponent', () => {
  let component: IconComponent;
  let fixture: ComponentFixture<IconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use material icon mode when name is provided', () => {
    fixture.componentRef.setInput('name', 'home');

    expect(component.hasMaterialIcon()).toBe(true);
    expect(component.hasProjectedFallback()).toBe(false);
  });

  it('should use custom registry icon when provided', () => {
    fixture.componentRef.setInput('customIcon', 'sparkle');

    expect(component.hasCustomRegistryIcon()).toBe(true);
    expect(component.resolvedCustomIcon()).toBeTruthy();
  });

  it('should fall back to projected content when no source is provided', () => {
    expect(component.hasProjectedFallback()).toBe(true);
  });
});
