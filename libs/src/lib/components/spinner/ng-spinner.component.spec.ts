import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerComponent } from './ng-spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clamp progress between 0 and 100', () => {
    fixture.componentRef.setInput('progress', 140);

    expect(component.normalizedProgress()).toBe(100);
  });

  it('should render dots variant', () => {
    fixture.componentRef.setInput('variant', 'dots');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.ng-spinner__dots')).toBeTruthy();
  });
});
