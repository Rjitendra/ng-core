import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgAgGridComponent } from './ng-ag-grid.component';

describe('NgAgGridComponent', () => {
  let component: NgAgGridComponent;
  let fixture: ComponentFixture<NgAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgAgGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgAgGridComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
