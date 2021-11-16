import {AbstractControlOptions, AsyncValidatorFn, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {v4} from 'uuid';
import {CalendarEvent} from '../models/calendar-event';

export class CreateEventFormGroup<T = void> extends FormGroup {

  constructor(validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super({
      uuid: new FormControl(),
      dates: new FormControl(),
      beginDate: new FormControl(),
      endDate: new FormControl(),
      fullDayEvent: new FormControl(),
      name: new FormControl(),
      metadata: new FormControl(),
    }, validatorOrOpts, asyncValidator);
  }

  get uuidFC(): FormControl {
    return this.get('uuid') as FormControl;
  }

  get datesFC(): FormControl {
    return this.get('dates') as FormControl;
  }

  get beginDateFC(): FormControl {
    return this.get('beginDate') as FormControl;
  }

  get endDateFC(): FormControl {
    return this.get('endDate') as FormControl;
  }

  get fullDayEventFC(): FormControl {
    return this.get('fullDayEvent') as FormControl;
  }

  get nameFC(): FormControl {
    return this.get('name') as FormControl;
  }

  get metadataFC(): FormControl {
    return this.get('metadata') as FormControl;
  }

  toCalendarEvent(): CalendarEvent<T> {
    const calendarEvent: CalendarEvent<T> = this.value;

    // Gestion de l'uuid
    if (!calendarEvent.uuid) {
      calendarEvent.uuid = v4();
    }

    // Gestions des dates
    calendarEvent.dates = [];
    if (calendarEvent.beginDate) {
      calendarEvent.dates.push(new Date(calendarEvent.beginDate));
      if (calendarEvent.endDate && calendarEvent.beginDate.toLocaleDateString() != calendarEvent.endDate.toLocaleDateString()) {
        const previousDate: Date = calendarEvent.beginDate;
        const nextDate: Date = calendarEvent.beginDate;
        while (nextDate.toLocaleDateString() != calendarEvent.endDate.toLocaleDateString()) {
          calendarEvent.dates.push(new Date(nextDate));
          previousDate.setDate(nextDate.getDate());
          nextDate.setDate(nextDate.getDate() + 1);
        }
      }
    }

    return calendarEvent;
  }
}
