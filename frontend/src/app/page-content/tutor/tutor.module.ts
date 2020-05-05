import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TutorListComponent } from './containers/tutor-list/tutor-list.component';
import { ViewTutorComponent } from './components/view-tutor/view-tutor.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserModule } from '@angular/platform-browser';


const routes: Routes = [
    {
        path: '',
        component: TutorListComponent
    },
    {
        path: ':id/view',
        component: ViewTutorComponent
    }
];

const COMPONENTS = [
    TutorListComponent,
    ViewTutorComponent
]
@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgxPaginationModule,
        RouterModule.forChild(routes)
    ],
    declarations: [...COMPONENTS],
    exports: [],
})
export class TutorModule { }
