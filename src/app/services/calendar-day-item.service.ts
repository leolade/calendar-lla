import {Injectable} from '@angular/core';
import {CalendarDayItem} from '../models/calendar-day-item';
import {CalendarEvent} from '../models/calendar-event';

@Injectable({
  providedIn: 'root'
})
export class CalendarDayItemService {

  constructor() {
  }

  buildItems(days: Date[], events: CalendarEvent[]): CalendarDayItem[] {
    return days.map(
      (day: Date) => {
        return {
          date: day,
          events: events.filter((event: CalendarEvent) => event.dates
            .map((dateIterator: Date) => dateIterator.toLocaleDateString())
            .some((dateIterator: string) => dateIterator === day.toLocaleDateString()))
        } as CalendarDayItem;
      }
    );
  }
}
