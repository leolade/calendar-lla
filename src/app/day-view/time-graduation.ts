export class TimeGraduation {
  dateTime: number = 0;
  isHourStep: boolean = false;
  isMidHourStep: boolean = false;
  isQuarterHourStep: boolean = false;

  constructor(public date: Date, public isFirstStep: boolean = false, public isLastStep: boolean = false) {
    this.dateTime = date.getTime();
    const minutes: number = date.getMinutes();
    switch (minutes) {
      case 0:
        this.isHourStep = true;
        break;
      case 15:
      case 45:
        this.isQuarterHourStep = true;
        break;
      case 30:
        this.isMidHourStep = true;
        break;
    }
  }

}
