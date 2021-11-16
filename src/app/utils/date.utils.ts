export class DateUtils {
  static getCurrentDate(): Date {
    return new Date();
  }

  static getCurrentMonth(): number {
    return DateUtils.getCurrentDate().getMonth();
  }

  static getCurrentDay(): number {
    return DateUtils.getCurrentDate().getDate();
  }

  static getCurrentYear(): number {
    return DateUtils.getCurrentDate().getFullYear();
  }

  /**
   * Return current month NOT zero-based
   */
  static getCurrentMonthNumber(): number {
    return DateUtils.getCurrentDate().getMonth() + 1;
  }

  static isDateFromMonth(date: Date, month: number): boolean {
    if (date === null || date === undefined) {
      return false;
    }
    return date.getMonth() == month;
  }

  static getMonthName(month: number, format: "numeric" | "2-digit" | "long" | "short" | "narrow" = 'long'): string {
    const currDate: Date = DateUtils.getCurrentDate();
    currDate.setMonth(month)
    return currDate.toLocaleString('default', {month: format});
  }

  static getDayName(date: Date): string {
    return date.toLocaleString('default', {weekday: 'long'});
  }

  static getAllMonthsNames(format: "numeric" | "2-digit" | "long" | "short" | "narrow" = 'long'): string[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthIndex: number) => DateUtils.getMonthName(monthIndex, format));
  }

  static getMonthDatesWithCompleteWeeks(year: number, month: number): Date[] {
    const firstDayOfMonth: Date = new Date(year, month, 1);
    const days: Date[] = [firstDayOfMonth];

    let dateIterator: Date = new Date(firstDayOfMonth);
    dateIterator.setDate(dateIterator.getDate() - 1);

    // On complete avant le premier jour du mois, jusuqu'a un lundi
    while (dateIterator.getDay() != 0) {
      days.unshift(new Date(dateIterator))
      dateIterator.setDate(dateIterator.getDate() - 1);
    }

    // On reset le positionnement pour partir dans l'autre sens
    dateIterator = new Date(firstDayOfMonth);
    dateIterator.setDate(dateIterator.getDate() + 1);

    while (days.length < 35) {
      days.push(new Date(dateIterator))
      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    return days;
  }

  static getDateTimeFromHours(date: Date, hour: number): Date {
    date.setHours(0, 0, 0, 0);
    return this.getDateTimeFromHourAndMinutes(date, Math.floor(hour), Math.round(parseFloat((hour % 1).toFixed(4)) * 60))
  }

  static getDateTimeFromHourAndMinutes(date: Date, hour: number, minutes: number): Date  {
    const result: Date = new Date(date);
    result.setHours(hour);
    result.setMinutes(minutes);
    return result;
  }
}
