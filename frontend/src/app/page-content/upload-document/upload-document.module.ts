import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AdminAuthDirective } from '@app/auth.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { UploadDocumentComponent } from './upload-document.component';


const routes: Routes = [
    {
        path: '',
        component: UploadDocumentComponent
    },
];

const COMPONENTS = [
    UploadDocumentComponent

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
export class UploadDocumentModule { }
