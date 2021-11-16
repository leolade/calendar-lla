import { Component } from '@angular/core';
import {DateUtils} from './utils/date.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'calendar-lla';

  constructor() {
    console.log(DateUtils.getAllMonthsNames())
    console.log(DateUtils.getMonthDatesWithCompleteWeeks(2021, 10))
  }
}
