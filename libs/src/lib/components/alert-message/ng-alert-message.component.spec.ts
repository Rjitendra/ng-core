import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertMessageComponent } from './ng-alert-message.component';

describe('AlertMessageComponent', () => {
  let component: AlertMessageComponent;
  let fixture: ComponentFixture<AlertMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertMessageComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('messageText', 'Saved successfully\nRefresh the page');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should split heading and detail lines', () => {
    expect(component.heading()).toBe('Saved successfully');
    expect(component.detailLines()).toEqual(['Refresh the page']);
  });

  it('should emit clear event', () => {
    const emitSpy = vi.spyOn(component.clearAlert, 'emit');

    component.onCloseAlert(4);

    expect(emitSpy).toHaveBeenCalledWith(4);
  });
});
