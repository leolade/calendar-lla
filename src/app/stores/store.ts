export interface Store<T> {

  findByUuid(uuid: string): T | undefined;
  findManyByUuid(uuids: string[]): T[];
  deleteByUuid(uuid: string): void;
  deleteManyByUuid(uuids: string[]): void;
  delete(calendarEvent: T): void;
  deleteMany(calendarEvents: T[]): void;
  update(calendarEvent: T): void;
  updateMany(calendarEvents: T[]): void;
  getAllEventsForDate(date: Date): T[];
  getEvents(days: Date[]): T[];
  create(param: T): void;
  emitChangedEvents(events: T[]): void;
  emitChangedEvent(event: T): void;

}
