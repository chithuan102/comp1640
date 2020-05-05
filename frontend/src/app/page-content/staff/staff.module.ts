import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { StaffListComponent } from './containers/staff-list/staff-list.component';
import { ViewStaffComponent } from './components/view-staff/view-staff.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PermissionGuard } from '@app/permission-guard.service';


const routes: Routes = [
    {
        path: '',
        component: StaffListComponent
    },
    {
        path: ':id/view',
        canActivate: [PermissionGuard],
        data: {
            role: ['ADMIN'],
        },
        component: ViewStaffComponent
    }
];

const COMPONENTS = [
    StaffListComponent,
    ViewStaffComponent,
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        RouterModule.forChild(routes),
        NgxPaginationModule
    ],
    declarations: [...COMPONENTS],
    exports: [],
})
export class StaffModule { }
