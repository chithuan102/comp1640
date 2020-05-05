import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionListComponent } from './containers/permission-list/permission-list.component';
import { ViewPermissionComponent } from './components/view-permission/view-permission.component';


const routes: Routes = [
    {
        path: '',
        component: PermissionListComponent
    },
    {
        path: ':id/view',
        component: ViewPermissionComponent
    },
    {
        path: 'create',
        component: ViewPermissionComponent
    }
];

const COMPONENTS = [
    PermissionListComponent,
    ViewPermissionComponent
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        RouterModule.forChild(routes)
    ],
    declarations: [...COMPONENTS],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class PermissionModule { }
