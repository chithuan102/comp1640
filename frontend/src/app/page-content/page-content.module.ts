import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { PageContentComponent } from './page-content.component';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CoreModule } from '../core/core.module';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MeetingComponent } from './meeting/meeting.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { AuthenGuard } from '@app/auth.service';
import { PermissionGuard } from '@app/permission-guard.service';
import { PermissionDenyComponent } from '@app/errors/permission-deny/permission-deny.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
const routes: Routes = [
    {
        path: '',
        component: PageContentComponent,
        canActivate: [AuthenGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                canActivate: [AuthenGuard],
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            {
                path: 'message',
                canActivate: [AuthenGuard],
                loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
            },
            {
                path: 'blog',
                canActivate: [AuthenGuard],
                loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
            },
            {
                path: 'role',
                canActivate: [PermissionGuard],
                data: {
                    role: ['ADMIN']
                },
                loadChildren: () => import('./permission/permission.module').then(m => m.PermissionModule)
            },
            {
                path: 'student',
                canActivate: [PermissionGuard],
                data: {
                    role: ['ADMIN', 'TUTOR', 'STAFF']
                },
                loadChildren: () => import('./student/student.module').then(m => m.StudentModule)
            },
            {
                path: 'tutor',
                canActivate: [PermissionGuard],
                data: {
                    role: ['ADMIN', 'STAFF']
                },
                loadChildren: () => import('./tutor/tutor.module').then(m => m.TutorModule)
            },
            {
                path: 'staff',
                canActivate: [PermissionGuard],
                data: {
                    role: ['ADMIN']
                },
                loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule)
            },
            {
                path: 'meeting',
                canActivate: [AuthenGuard],
                loadChildren: () => import('./meeting/meeting.module').then(m => m.MeetingModule)
            },
            {
                path: 'profile',
                canActivate: [AuthenGuard],
                loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: 'upload-document',
                canActivate: [AuthenGuard],
                loadChildren: () => import('./upload-document/upload-document.module').then(m => m.UploadDocumentModule)
            },
            {
                path: 'no-permission',
                component: PermissionDenyComponent
            },
        ]
    },

];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CoreModule,
        CommonModule,
        FormsModule,
        NgSelectModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
    ],
    exports: [],
    declarations: [
        PageContentComponent,
        HeaderComponent,
        SidebarComponent,
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class PageContentModule { }
