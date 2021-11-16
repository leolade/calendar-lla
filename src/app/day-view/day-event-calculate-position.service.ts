import { Injectable } from '@angular/core';
import {CalendarEvent} from '../models/calendar-event';

@Injectable({
  providedIn: 'root'
})
export class DayEventCalculatePositionService {

  constructor() { }

  evaluateEventRect(
    event: CalendarEvent,
    layoutsHoursElements: HTMLCollectionOf<Element>,
    elementToHourFn: (element: Element) => Date | null,
    topSelector: (element: Element) => number = (element: Element) => (element as HTMLElement).getBoundingClientRect().top,
    leftSelector: (element: Element) => number = (element: Element) => (element as HTMLElement).getBoundingClientRect().left,
    widthSelector: (element: Element) => number = (element: Element) => (element as HTMLElement).getBoundingClientRect().width,
  ): DOMRect | undefined {
    const divLayoutToMap: Map<Element, Date> = new Map();
    Array
      .from(layoutsHoursElements)
      .forEach((element: Element) => {
        const date: Date | null = elementToHourFn(element);
        if (date) {
          divLayoutToMap.set(element, date)
        }
      });

    const sortedDivLayoutToMap: [Element, Date][] = [...divLayoutToMap.entries()];
    sortedDivLayoutToMap.sort(
      ([element1, date1]: [Element, Date], [element2, date2]: [Element, Date]) => {
        if (!date1) {
          return -1;
        }
        if (!date2) {
          return 1;
        }
        return date1.getTime() > date2.getTime() ? 1 : (date1.getTime() < date2.getTime() ? -1 : 0);
      });

    const latestBoundIndex: number = sortedDivLayoutToMap
      .findIndex(([element, date]: [Element, Date]) => {
        return event.beginDate && (date.getTime() >= event.beginDate.getTime());
      });

    const earliestBound: [Element, Date] | undefined = sortedDivLayoutToMap[latestBoundIndex];
    const latestBound: [Element, Date] | undefined = sortedDivLayoutToMap[latestBoundIndex + 1];

    if (!earliestBound) {
      return;
    }

    return {
      ...earliestBound[0].getBoundingClientRect(),
      top: topSelector(earliestBound[0]),
      left: leftSelector(earliestBound[0]),
      width: widthSelector(earliestBound[0]),
    };
  }
}
