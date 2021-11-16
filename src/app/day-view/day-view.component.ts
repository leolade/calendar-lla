import {CdkDrag, CdkDragMove, CdkDragRelease} from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CalendarEvent} from '../models/calendar-event';
import {PositionnedCalendarEvent} from '../models/positionned-calendar-event';
import {CalendarEventOrchestratorService} from '../stores/calendar-event-orchestrator.service';
import {DateUtils} from '../utils/date.utils';
import {DayEventCalculatePositionService} from './day-event-calculate-position.service';
import {TimeGraduation} from './time-graduation';

@Component({
  selector: 'calendar-lla-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayViewComponent implements OnInit, OnChanges {

  LAYOUT_HOUR_ID_PREFIX: string = 'layout-hour-';
  LAYOUT_HOUR_CLASS: string = 'day-time-container';
  LAYOUT_HOUR_EVENT_GRID_CLASS: string = 'event-grid';

  @Input() day: Date = DateUtils.getCurrentDate();
  @Input() timeStart: number = 0;
  @Input() timeEnd: number = 24;
  @Output() onNavigateBack: EventEmitter<void> = new EventEmitter<void>();

  @ViewChildren(CdkDrag) children: QueryList<CdkDrag<CalendarEvent>> = new QueryList();

  private draggingEvent: BehaviorSubject<CalendarEvent | undefined> = new BehaviorSubject<CalendarEvent | undefined>(undefined);
  private dayChangesSubject: BehaviorSubject<Date> = new BehaviorSubject<Date>(this.day);

  private minutesGraduation: number = 15;
  events$: Observable<PositionnedCalendarEvent[]>;
  timeStartBound: Date = this.evaluateTimeStartBound();
  timeEndBound: Date = this.evaluateTimeEndBound();

  timeAxesValues: TimeGraduation[] = [];

  constructor(
    private eventOrchestratorService: CalendarEventOrchestratorService,
    private dayEventCalculatePositionService: DayEventCalculatePositionService,
  ) {
    this.evaluatesTimeBounds();

    this.draggingEvent.asObservable().subscribe(
      (event: CalendarEvent | undefined) => {

      }
    );

    this.events$ = combineLatest([
      this.eventOrchestratorService.data$,
      this.dayChangesSubject.asObservable(),
      this.draggingEvent.asObservable(),
    ])
      .pipe(
        map(([events, date, tmpEvent]: [CalendarEvent[], Date, CalendarEvent | undefined]) => {
          const eventsToDisplay: CalendarEvent[] = events
            .filter((event: CalendarEvent) => event.dates.some((eventDate: Date) => eventDate.toLocaleDateString() === date.toLocaleDateString()))
          if (tmpEvent) {
            eventsToDisplay.push(tmpEvent);
          }
          return eventsToDisplay.map(
            (event: CalendarEvent) => {
              if (tmpEvent?.uuid && event.uuid !== tmpEvent.uuid) {
                return {
                  rect: this.evaluateEventRect(event),
                  ...event
                }
              }
              return event;
            }
          );
        })
      )
  }

  ngOnInit(): void {
  }

  onBackClicked(): void {
    this.onNavigateBack.emit();
  }

  private evaluatesTimeBounds(): void {
    this.evaluateTimeStartBound();
    this.evaluateTimeEndBound();
    this.evaluatesTimeAxesValues();
  }

  private evaluatesTimeAxesValues(): void {
    this.timeAxesValues = [];
    let timeToPush: Date = new Date(this.timeStartBound);
    while (timeToPush.getTime() === this.timeStartBound.getTime() || timeToPush.getTime() < this.timeEndBound.getTime()) {
      this.timeAxesValues.push(new TimeGraduation(timeToPush, timeToPush.getTime() === this.timeStartBound.getTime()));

      // We add the graduation for next axes values
      timeToPush = new Date(timeToPush);
      const minutesToAdd: number = this.minutesGraduation - (timeToPush.getMinutes() % this.minutesGraduation);
      timeToPush.setMinutes(timeToPush.getMinutes() + minutesToAdd);
    }
    this.timeAxesValues.push(new TimeGraduation(timeToPush, false, true));
  }

  private evaluateTimeStartBound(): Date {
    this.timeStartBound = DateUtils.getDateTimeFromHours(this.day, this.timeStart);
    return this.timeStartBound;
  }

  private evaluateTimeEndBound(): Date {
    this.timeEndBound = DateUtils.getDateTimeFromHours(this.day, this.timeEnd);
    return this.timeEndBound;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.timeStart || changes?.timeEnd) {
      this.evaluatesTimeBounds();
    }
    if (changes?.day) {
      this.dayChangesSubject.next(this.day);
    }
  }

  onDragMove(event: CdkDragMove<CalendarEvent<void>>): void {
    const startTime: Date | null = this.getClosestStartTime(event);
    if (!startTime || startTime.getTime() === this.draggingEvent.getValue()?.beginDate?.getTime()) {
      return;
    }
    const endTime: Date = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 15);
    const draggingEvent: CalendarEvent = {
      ...event.source.data,
      beginDate: startTime,
      endDate: endTime,
    };
    this.draggingEvent.next(draggingEvent);
    const nextDomRect: DOMRect | undefined = this.evaluateEventRect(draggingEvent);
    if (nextDomRect) {
      this.updateEventPosition(draggingEvent, nextDomRect)
    }
    console.log(startTime);
  }

  private getClosestStartTime(event: CdkDragMove): Date | null {
    const eventElement: HTMLElement = event.source.element.nativeElement;
    const closestTimeContainer: Element | undefined =
      document
        .elementsFromPoint(eventElement.getBoundingClientRect().x, eventElement.getBoundingClientRect().y)
        .find((element: Element) => (element.id || '').startsWith(this.LAYOUT_HOUR_ID_PREFIX))
    ;
    if (!closestTimeContainer) {
      return null;
    }
    return this.getDateFromLayoutHourContainerElement(closestTimeContainer);

  }

  onDragReleased($event: CdkDragRelease): void {
    this.draggingEvent.next(undefined);
  }

  private updateEventPosition(value: CalendarEvent, boundingClientRect: DOMRect): void {
    const eventCdkDrag: CdkDrag | undefined = this.children.find((item: CdkDrag<CalendarEvent>) => {
      return item.data?.uuid === value?.uuid && !item.element.nativeElement.classList.contains('cdk-drag-dragging');
    });

    if (!eventCdkDrag) {
      return;
    }

    eventCdkDrag.element.nativeElement.style.top = `${boundingClientRect.top}px`;
    eventCdkDrag.element.nativeElement.style.left = `${boundingClientRect.left}px`;
    eventCdkDrag.element.nativeElement.style.width = `${boundingClientRect.width}px`;
  }

  private evaluateEventRect(
    event: CalendarEvent
  ): DOMRect | undefined {
    return this.dayEventCalculatePositionService.evaluateEventRect(
      event,
      document.getElementsByClassName(this.LAYOUT_HOUR_CLASS),
      (element : Element) => this.getDateFromLayoutHourContainerElement(element),
      (element: Element) => (element as HTMLElement).offsetTop || 0,
      (element: Element) => {
        const eventGrid: Element[] = Array.from(element.getElementsByClassName(this.LAYOUT_HOUR_EVENT_GRID_CLASS)) || [];
        let leftOffset: number = 0;
        if (eventGrid.length > 0) {
          leftOffset = (eventGrid[0] as HTMLElement).offsetLeft;
        }
        return leftOffset > 0 ? leftOffset : element.getBoundingClientRect().left;
      },
      (element: Element) => {
        const eventGrid: Element[] = Array.from(element.getElementsByClassName(this.LAYOUT_HOUR_EVENT_GRID_CLASS)) || [];
        let width: number = 0;
        if (eventGrid.length > 0) {
          width = (eventGrid[0] as HTMLElement).offsetWidth;
        }
        return width > 0 ? width : element.getBoundingClientRect().width;
      },
    );
  }

  private getDateFromLayoutHourContainerElement(element: Element): Date | null {
    const dateTime: number = parseInt(element.id.replace(this.LAYOUT_HOUR_ID_PREFIX, ''));

    if (isNaN(dateTime)) {
      return null;
    }

    return new Date(dateTime);
  }

  trackByUuid(index: number, event: PositionnedCalendarEvent): string {
    return event.uuid;
  }
}
