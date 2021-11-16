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
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateEventDialogComponent} from '../create-event-dialog/create-event-dialog.component';
import {CalendarDayItem} from '../models/calendar-day-item';
import {CalendarEvent} from '../models/calendar-event';
import {CalendarDayItemService} from '../services/calendar-day-item.service';
import {CalendarEventOrchestratorService} from '../stores/calendar-event-orchestrator.service';
import {DateUtils} from '../utils/date.utils';

@Component({
  selector: 'calendar-lla-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthViewComponent implements OnInit, OnChanges {

  @Input() month: number = DateUtils.getCurrentMonth();
  @Input() year: number = DateUtils.getCurrentYear();
  @Output() daySelected: EventEmitter<Date> = new EventEmitter<Date>();

  weeksDays$: Observable<CalendarDayItem[][]>;
  dayNames: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  private activeDaysChangedSubject: BehaviorSubject<Date[]> = new BehaviorSubject<Date[]>([]);

  constructor(
    private eventOrchestratorService: CalendarEventOrchestratorService,
    private calendarDayItemService: CalendarDayItemService,
    private dialog: MatDialog,
  ) {
    this.weeksDays$ =
      combineLatest([
        this.activeDaysChangedSubject.asObservable(),
        this.eventOrchestratorService.data$
      ]).pipe(
        map(([dates, calendarEvents]: [Date[], CalendarEvent[]]) => {
          const weeksDays: CalendarDayItem[][] = [];
          const dayItems: CalendarDayItem[] = this.calendarDayItemService.buildItems(dates, calendarEvents);
          for (let i = 0; i < 5; i++) {
            let weekDay: CalendarDayItem[] = [];
            for (let i = 0; i < 7; i++) {
              let dayToPush: CalendarDayItem | undefined = dayItems.shift();
              if (dayToPush) {
                weekDay.push(dayToPush);
              }
            }
            weeksDays.push(weekDay);
          }
          return weeksDays;
        })
      )
  }

  ngOnInit(): void {
    this.evaluateMonthsDays()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.month || changes.year) {
      this.evaluateMonthsDays()
    }
  }

  private evaluateMonthsDays(): void {
    this.activeDaysChangedSubject.next(DateUtils.getMonthDatesWithCompleteWeeks(this.year, this.month));
  }

  onDaySelected(date: Date): void {
    this.daySelected.emit(date);
  }

  onDayDoubleClickHandler($event: MouseEvent, day: CalendarDayItem): void {
    $event.stopPropagation();
    this.dialog.open<CreateEventDialogComponent, Partial<CalendarEvent>, CalendarEvent>(CreateEventDialogComponent, {
      data: {
        beginDate: day?.date,
        endDate: day?.date
      }
    }).afterClosed()
      .subscribe((calendarEvent: CalendarEvent | undefined) => {
        if (calendarEvent) {
          this.eventOrchestratorService.create(calendarEvent)
        }
      });
  }
}
