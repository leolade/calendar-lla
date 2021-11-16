import {CalendarEvent} from './calendar-event';

export class PositionnedCalendarEvent<T = void> extends CalendarEvent<T> {
  rect?: DOMRect;
}
