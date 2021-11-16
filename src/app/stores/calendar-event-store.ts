import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {CalendarEvent} from '../models/calendar-event';
import {Store} from './store';

export abstract class CalendarEventStore implements Store<CalendarEvent> {

  private dataSubject: BehaviorSubject<CalendarEvent[]> = new BehaviorSubject<CalendarEvent[]>([]);
  private dateEventsChangedSubject: Subject<Date> = new Subject();
  private calendarEventChangedSubject: Subject<CalendarEvent> = new Subject();
  data$: Observable<CalendarEvent[]> = this.dataSubject.asObservable();
  dateEventsChanged$: Observable<[Date, CalendarEvent[]]> = this.dateEventsChangedSubject.asObservable()
    .pipe(
      map((date: Date) => {
        return [date, this.getAllEventsForDate(date)]
      })
    );
  calendarEventChanged$: Observable<[Date[], CalendarEvent]> = this.calendarEventChangedSubject.asObservable()
    .pipe(map((calendatEvent: CalendarEvent) => [calendatEvent.dates, calendatEvent]));

  constructor() {
  }

  init(calendarEvents: CalendarEvent[]): void {
    this.dataSubject.next(calendarEvents);
  }

  findByUuid(uuid: string): CalendarEvent | undefined {
    return this.dataSubject.getValue().find(this.compare(uuid))
  }

  findManyByUuid(uuids: string[]): CalendarEvent[] {
    return this.dataSubject.getValue().filter(this.filter(uuids))
  }

  deleteByUuid(uuid: string): void {
    const itemToDelete: CalendarEvent | undefined = this.findByUuid(uuid);
    if (itemToDelete) {
      this.delete(itemToDelete);
    }
  }

  deleteManyByUuid(uuids: string[]): void {
    this.deleteMany(this.findManyByUuid(uuids));
  }

  delete(calendarEvent: CalendarEvent): void {
    const index = this.dataSubject.getValue().findIndex(this.compare(calendarEvent.uuid));
    if (index > -1) {
      const tmpData: CalendarEvent[] = this.dataSubject.getValue();
      tmpData.splice(index, 1);
      this.dataSubject.next(tmpData);
    }
  }

  deleteMany(calendarEvents: CalendarEvent[]): void {
    calendarEvents.forEach((calendarEvent: CalendarEvent) => this.delete(calendarEvent));
  }

  update(calendarEvent: CalendarEvent): void {
    const index = this.dataSubject.getValue().findIndex(this.compare(calendarEvent.uuid));
    if (index > -1) {
      const tmpData: CalendarEvent[] = this.dataSubject.getValue();
      tmpData[index] = calendarEvent;
      this.dataSubject.next(tmpData);
    }
  }

  updateMany(calendarEvents: CalendarEvent[]): void {
    calendarEvents.forEach((calendarEvent: CalendarEvent) => this.update(calendarEvent));
  }

  emitChangedEvents(events: CalendarEvent[]): void {
    events.forEach((event: CalendarEvent) => this.emitChangedEvent(event))
  }

  emitChangedEvent(event: CalendarEvent): void {
    event.dates.forEach(
      (date: Date) => this.dateEventsChangedSubject.next(date)
    );
    this.calendarEventChangedSubject.next(event);

  }

  compare(uuid: string): (c: CalendarEvent) => boolean {
    return (c: CalendarEvent) => c.uuid === uuid;
  }

  filter(uuids: string[]): (c: CalendarEvent) => boolean {
    return (c: CalendarEvent) => uuids.includes(c.uuid);
  }

  getAllEventsForDate(date: Date): CalendarEvent[] {
    return this.dataSubject.getValue().filter(
      (calendarEvent: CalendarEvent) => {
        return calendarEvent.dates
          .map((dateIterator: Date) => dateIterator.toLocaleDateString())
          .includes(date.toLocaleDateString())
      }
    );
  }

  getEvents(days: Date[]): CalendarEvent[] {
    const daysToString: string[] = days.map((day: Date) => day.toLocaleDateString());
    return this.dataSubject.getValue().filter(
      (calendarEvent: CalendarEvent) => {
        return calendarEvent.dates
          .map((day: Date) => day.toLocaleDateString())
          .some((day: string) => daysToString.includes(day));
      }
    );
  }

  create(param: CalendarEvent): void {
    const tmpData: CalendarEvent[] = this.dataSubject.getValue();
    tmpData.push(param);
    this.dataSubject.next(tmpData);
    this.emitChangedEvent(param);
  }
}
