import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProfileComponent } from './profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewStudentComponent } from '../student/components/view-student/view-student.component';
import { StudentModule } from '../student/student.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgxPaginationModule } from 'ngx-pagination';


const routes: Routes = [
    {
        path: '',
        component: ProfileComponent
    },
];

const COMPONENTS = [
    ProfileComponent,
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgbModule,
        NgxPaginationModule,
        RouterModule.forChild(routes)
    ],
    declarations: [...COMPONENTS, UserProfileComponent],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class ProfileModule { }
