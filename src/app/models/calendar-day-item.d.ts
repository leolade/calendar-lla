import {CalendarEvent} from './calendar-event';

export class CalendarDayItem<T = void> {
  date: Date;
  events: CalendarEvent<T>[];
}
