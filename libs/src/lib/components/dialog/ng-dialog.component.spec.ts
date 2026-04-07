import { TestBed } from '@angular/core/testing';
import { NgDialogComponent } from './ng-dialog.component';
import { APP_DIALOG_DATA, APP_DIALOG_REF } from '../../services/app-dialog.types';

describe('NgDialogComponent', () => {
  it('should close with confirm payload', async () => {
    const close = vi.fn();

    await TestBed.configureTestingModule({
      imports: [NgDialogComponent],
      providers: [
        {
          provide: APP_DIALOG_DATA,
          useValue: {
            title: 'Delete item',
            message: 'This action cannot be undone.',
            type: 'error',
            data: { id: 1 },
          },
        },
        {
          provide: APP_DIALOG_REF,
          useValue: { close },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(NgDialogComponent);
    const component = fixture.componentInstance;

    component.onConfirm();

    expect(close).toHaveBeenCalledWith({
      action: 'confirm',
      data: { id: 1 },
    });
  });
});
