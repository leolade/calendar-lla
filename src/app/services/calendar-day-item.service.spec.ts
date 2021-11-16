import { TestBed } from '@angular/core/testing';

import { CalendarDayItemService } from './calendar-day-item.service';

describe('CalendarDayItemService', () => {
  let service: CalendarDayItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarDayItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
