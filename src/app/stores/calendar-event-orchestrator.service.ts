import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {CalendarEvent} from '../models/calendar-event';
import {CalendarEventStore} from './calendar-event-store';
import {DefaultCalendarEventStore} from './default-calendar-event-store';
import {Store} from './store';

@Injectable({
  providedIn: 'root'
})
export class CalendarEventOrchestratorService implements Store<CalendarEvent> {

  private store?: CalendarEventStore;

  constructor() {
  }

  init(calendarEvents: CalendarEvent[], store: CalendarEventStore = new DefaultCalendarEventStore()): void {
    this.store = store;
    this.store.init(calendarEvents);
  }

  get data$(): Observable<CalendarEvent[]> {
    return this.getStore().data$;
  }

  findByUuid(uuid: string): CalendarEvent | undefined {
    return this.getStore().findByUuid(uuid);
  }

  findManyByUuid(uuids: string[]): CalendarEvent[] {
    return this.getStore().findManyByUuid(uuids) || [];
  }

  deleteByUuid(uuid: string): void {
    this.getStore().deleteByUuid(uuid);
  }

  deleteManyByUuid(uuids: string[]): void {
    this.getStore().deleteManyByUuid(uuids);
  }

  delete(calendarEvent: CalendarEvent): void {
    this.getStore().delete(calendarEvent);
  }

  deleteMany(calendarEvents: CalendarEvent[]): void {
    this.getStore().deleteMany(calendarEvents);
  }

  update(calendarEvent: CalendarEvent): void {
    this.getStore().update(calendarEvent);
  }

  updateMany(calendarEvents: CalendarEvent[]): void {
    this.getStore().updateMany(calendarEvents);
  }

  emitChangedEvents(events: CalendarEvent[]): void {
    this.getStore().emitChangedEvents(events);
  }

  emitChangedEvent(event: CalendarEvent): void {
    this.getStore().emitChangedEvent(event);
  }

  getAllEventsForDate(date: Date): CalendarEvent[] {
    return this.getStore().getAllEventsForDate(date) || [];
  }

  getEvents(days: Date[]): CalendarEvent[] {
    return this.getStore().getEvents(days) || [];
  }

  create(param: CalendarEvent): void {
    this.getStore().create(param);
  }

  private getStore(): CalendarEventStore {
    if (this.store) {
      return this.store;
    } else {
      throw ('Aucun store défini pour gérer les évènements de calendrier')
    }
  }
}
