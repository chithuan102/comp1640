import { CommonModule } from '@angular/common';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlogLayoutComponent } from './containers/blog-layout/blog-layout.component';
import { BlogListComponent } from './components/blog-list/blog-list.component';
import { BlogDetailComponent } from './components/blog-detail/blog-detail.component';
import { BlogSidebarComponent } from './components/blog-sidebar/blog-sidebar.component';
import { BlogUploadComponent } from './components/blog-upload/blog-upload.component';
import { NgxPaginationModule } from 'ngx-pagination';
// import { CKEditorModule } from 'ng2-ckeditor';
import { CKEditorModule } from 'ngx-ckeditor';
const routes: Routes = [
    {
        path: '',
        component: BlogLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'blog-home',
                pathMatch: 'full'
            },
            {
                path: 'blog-home',
                component: BlogListComponent,

            },
            {
                path: 'blog-detail/:id',
                component: BlogDetailComponent,

            },
            {
                path: 'create',
                component: BlogUploadComponent,

            },
            {
                path: ':id/edit',
                component: BlogUploadComponent,

            },
        ]
    }

];

const COMPONENTS = [
    BlogListComponent,
    BlogDetailComponent,
    BlogSidebarComponent,
    BlogLayoutComponent
];

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        RouterModule.forChild(routes),
        CKEditorModule,
        NgxPaginationModule
    ],
    declarations: [...COMPONENTS, BlogUploadComponent],
    exports: [...COMPONENTS],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    entryComponents: [...COMPONENTS]
})
export class BlogModule { }
