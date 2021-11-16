import { TestBed } from '@angular/core/testing';

import { DayEventCalculatePositionService } from './day-event-calculate-position.service';

describe('DayEventCalculatePositionService', () => {
  let service: DayEventCalculatePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayEventCalculatePositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
