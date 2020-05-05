import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ChartsModule } from 'ng2-charts';
import { MeetingComponent } from './meeting.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
// import { FullCalendarModule } from 'ng-fullcalendar';

import { NgxPaginationModule } from 'ngx-pagination';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const routes: Routes = [
    {
        path: '',
        component: MeetingComponent
    },
];

const COMPONENTS = [
    MeetingComponent,

];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        ChartsModule,
        RouterModule.forChild(routes),
        FullCalendarModule,
        NgxPaginationModule,
        BsDatepickerModule.forRoot(),
        NgxMaterialTimepickerModule,
        NgbModule
    ],
    declarations: [...COMPONENTS],
    exports: [],
})
export class MeetingModule { }
