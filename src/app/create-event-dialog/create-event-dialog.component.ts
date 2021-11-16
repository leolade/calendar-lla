import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CreateEventFormGroup} from '../create-event-form/create-event-form-group';
import {CalendarEvent} from '../models/calendar-event';

@Component({
  selector: 'calendar-lla-create-event-dialog',
  templateUrl: './create-event-dialog.component.html',
  styleUrls: ['./create-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEventDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<CreateEventDialogComponent, CalendarEvent | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<CalendarEvent>
  ) {
  }

  ngOnInit(): void {
  }

  onFormSubmited($event: CreateEventFormGroup): void {
    const calendarEvent: CalendarEvent = $event.toCalendarEvent();
    if (calendarEvent) {
      this.dialogRef.close(calendarEvent);
    } else {
      this.dialogRef.close(undefined);
    }
  }
}
