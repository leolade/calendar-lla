import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalendarEvent} from '../models/calendar-event';
import {CreateEventFormGroup} from './create-event-form-group';

@Component({
  selector: 'calendar-lla-create-event-form',
  templateUrl: './create-event-form.component.html',
  styleUrls: ['./create-event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEventFormComponent implements OnInit {
  @Input() event: Partial<CalendarEvent> | undefined;
  @Output() submited: EventEmitter<CreateEventFormGroup> = new EventEmitter<CreateEventFormGroup>();

  form: CreateEventFormGroup = new CreateEventFormGroup();

  constructor() {
  }

  ngOnInit(): void {
    if (this.event) {
      this.form.patchValue(this.event);
    }
  }

  onSubmit($event: any): void {
    this.submited.emit(this.form);
  }
}
