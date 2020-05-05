import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ViewStudentComponent } from './components/view-student/view-student.component';
import { StudentListComponent } from './containers/student-list/student-list.component';
import { AdminAuthDirective } from '@app/auth.directive';
import { NgxPaginationModule } from 'ngx-pagination';


const routes: Routes = [
    {
        path: '',
        component: StudentListComponent
    },
    {
        path: ':id/view',
        component: ViewStudentComponent
    }
];

const COMPONENTS = [
    ViewStudentComponent,
    StudentListComponent

];
@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgxPaginationModule,
        // ToastrService,

        RouterModule.forChild(routes)
    ],
    declarations: [...COMPONENTS],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class StudentModule { }
