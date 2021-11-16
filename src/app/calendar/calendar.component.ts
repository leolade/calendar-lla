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
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CalendarEvent} from '../models/calendar-event';
import {CalendarViewType} from '../models/calendar-view-type';
import {CalendarEventOrchestratorService} from '../stores/calendar-event-orchestrator.service';
import {DateUtils} from '../utils/date.utils';

@Component({
  selector: 'calendar-lla-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit, OnChanges {

  @Input() view: CalendarViewType = 'MONTH';
  @Input() events: CalendarEvent[] = [
    {uuid: 'test', dates: [new Date()], name: `Test d'event`} as CalendarEvent
  ];
  @Output() viewChanges: EventEmitter<CalendarViewType> = new EventEmitter<CalendarViewType>();
  currentView: CalendarViewType = this.view;
  currentDateSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  currentDate$: Observable<Date> = this.currentDateSubject.asObservable();
  calendarMainTitle: string = "";

  constructor(private calendarEventStore: CalendarEventOrchestratorService) {
    this.evaluateCalendarMainTitle();
    this.calendarEventStore.init(this.events);
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.view) {
      this.onViewChanges(this.view);
    }
  }

  onDaySelected(date: Date): void {
    this.currentDateSubject.next(date);
    this.onViewChanges('DAY');
  }

  onViewChanges(view: CalendarViewType = this.currentView): void {
    this.currentView = view;
    this.viewChanges.emit(view);
    this.evaluateCalendarMainTitle();
  }

  onMonthSelected(date: Date): void {
    this.currentDateSubject.next(new Date(date));
    this.onViewChanges('MONTH');
  }

  private evaluateCalendarMainTitle(): void {
    const currentDay: Date = this.currentDateSubject.getValue()
    this.calendarMainTitle = "";
    switch (this.currentView) {
      case 'YEAR':
        this.calendarMainTitle = `${currentDay.getFullYear()}`
        break;
      case 'MONTH':
        this.calendarMainTitle = `${DateUtils.getMonthName(currentDay.getMonth())} ${currentDay.getFullYear()}`
        break;
      case 'DAY':
        this.calendarMainTitle = `${currentDay.toLocaleDateString()}`
        break;
    }
  }

  onNavigateBefore($event: MouseEvent): void {
    this.navigateInCurrentView(-1)
  }

  onNavigateAfter($event: MouseEvent): void {
    this.navigateInCurrentView(1)
  }

  private navigateInCurrentView(number: number): void {
    const date = new Date(this.currentDateSubject.getValue());
    switch (this.currentView) {
      case 'YEAR':
        date.setFullYear(date.getFullYear() + number);
        break;
      case 'MONTH':
        date.setMonth(date.getMonth() + number);
        break;
      case 'DAY':
        date.setDate(date.getDate() + number);
        break;
    }
    this.currentDateSubject.next(date);
    this.onViewChanges();
  }

  onTodayClick($event: MouseEvent): void {
    this.currentDateSubject.next(new Date());
    this.onViewChanges();
  }
}
