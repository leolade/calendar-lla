import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {CalendarDayItem} from '../models/calendar-day-item';
import {CalendarEvent} from '../models/calendar-event';
import {CalendarEventOrchestratorService} from '../stores/calendar-event-orchestrator.service';
import {DateUtils} from '../utils/date.utils';

@Component({
  selector: 'calendar-lla-month-view-day[day]',
  templateUrl: './month-view-day.component.html',
  styleUrls: ['./month-view-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthViewDayComponent implements OnInit, OnChanges {

  @Input() day: Date | undefined;
  @Input() events: CalendarEvent[] = [];
  @Output() daySelected: EventEmitter<Date> = new EventEmitter<Date>();

  dayName: string = '';
  dayId: string = '';

  constructor(
    private eventOrchestratorService: CalendarEventOrchestratorService,
  ) {
  }

  ngOnInit(): void {
  }

  onDayClicked(): void {
    this.daySelected.emit(this.day);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.day) {
      this.dayName = this.evaluateDayName();
      this.dayId = `id-${this.day?.getTime()}`
    }
  }

  private evaluateDayName(): string {
    let result: string = '';
    if (this.day) {
      result += this.day.getDate();
      if (this.day.getDate() == 1) {
        result += ` ${DateUtils.getMonthName(this.day.getMonth(), 'short')}`
      }
    }
    return result;
  }

  onEventDblClick($event: MouseEvent, calendarEvent: CalendarEvent): void {
    this.eventOrchestratorService.delete(calendarEvent);
    $event.stopPropagation();
  }

  onItemDrop($event: CdkDragDrop<CalendarEvent[], CalendarEvent[], CalendarEvent>): void {
    if ($event.previousContainer === $event.container) {
      return;
    }

    const newDates: Date[] = $event.item.data?.dates;

    if (this.day) {
      newDates.push(this.day);
    }
    const oldDate: Date = new Date(parseInt($event.previousContainer.id.replace('id-', ''), 10));
    const index = newDates.findIndex(
      (dateIterator: Date) => dateIterator.toLocaleDateString() === oldDate.toLocaleDateString()
    );
    if (index > -1) {
      newDates.splice(index, 1);
    }

    this.eventOrchestratorService.update({
      ...$event.item.data,
      dates: newDates
    })

  }
}
