import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthViewDayComponent } from './month-view-day.component';

describe('MonthViewDayComponent', () => {
  let component: MonthViewDayComponent;
  let fixture: ComponentFixture<MonthViewDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthViewDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthViewDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
