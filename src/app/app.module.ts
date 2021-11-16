import {DragDropModule} from '@angular/cdk/drag-drop';
import {registerLocaleData} from '@angular/common';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { MonthViewComponent } from './month-view/month-view.component';
import { MonthViewDayComponent } from './month-view-day/month-view-day.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './calendar/calendar.component';
import { DayViewComponent } from './day-view/day-view.component';
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';
import { CreateEventFormComponent } from './create-event-form/create-event-form.component';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    MonthViewComponent,
    MonthViewDayComponent,
    CalendarComponent,
    DayViewComponent,
    CreateEventDialogComponent,
    CreateEventFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatOptionModule,
    DragDropModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  exports: [
  ],
  providers: [
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
