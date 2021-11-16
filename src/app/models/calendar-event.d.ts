export class CalendarEvent<T = void> {
  uuid: string;
  dates: Date[];
  beginDate?: Date;
  endDate?: Date;
  fullDayEvent?: boolean;
  name: string;
  metadata?: T;
}
