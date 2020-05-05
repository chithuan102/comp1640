import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';


import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';


import { BoxContentComponent } from './components/box-content/box-content.component';
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import { ModalPopupCustomComponent } from './components/modal-popup-custom/modal-popup-custom.component';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminAuthDirective } from '@app/auth.directive';
import { ImportButtonComponent } from './components/import-button/import-button.component';
import { ExportButtonComponent } from './components/export-button/export-button.component';

const COMPONENTS = [
    BoxContentComponent,
    ModalPopupCustomComponent,
    ToggleSwitchComponent,
    AdminAuthDirective,
    ImportButtonComponent,
    ExportButtonComponent
];

@NgModule({
    imports: [
        TimepickerModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule,
        ToastrModule.forRoot(),
        NgSelectModule,
        CommonModule,
        NgxPaginationModule,
        // NgbModule
    ],
    exports: [...COMPONENTS],
    declarations: [...COMPONENTS],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CoreModule { }
