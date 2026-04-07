import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AlertComponent } from './ng-alert.component';
import { AlertService } from '../../services/alert.service';

describe('AlertComponent', () => {
  it('should collect alerts from the service', async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AlertComponent);
    const component = fixture.componentInstance;
    const service = TestBed.inject(AlertService);

    service.error({ errors: [{ message: 'Failed to save' }] });
    fixture.detectChanges();

    expect(component.alerts.length).toBe(1);
    expect(component.getAlertType(component.alerts[0])).toBe('error');
  });

  it('should resolve observable messages', async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AlertComponent);
    const component = fixture.componentInstance;
    const service = TestBed.inject(AlertService);

    service.info({ errors: [{ message: of('Loaded from stream') }] });
    fixture.detectChanges();

    expect(component.getMessageText(component.alerts[0])).toContain('Loaded from stream');
  });
});
