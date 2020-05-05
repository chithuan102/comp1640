import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TUTOR_MOCKS } from '../../tutor.mock';
import { NotifyService } from 'src/app/core/services/notify.service';
import { TutorDetail } from 'src/app/page-content/tutor/tutor.model';
import { TutorService } from '../../tutor.service';
import { PaginationInstance } from 'ngx-pagination';
import { UserDetail, ApiResponse } from '@app/app.models';
import { AppCoreService } from '@app/app.service';
import { END_POINT } from '@app/app.path';


@Component({
    selector: 'app-tutor-list',
    templateUrl: './tutor-list.component.html',
    styleUrls: ['./tutor-list.component.scss']
})
export class TutorListComponent implements OnInit {
    role = 'TUTOR';
    // sources: TutorDetail[] = TUTOR_MOCKS;
    sources: TutorDetail[] = [];
    listTutors: TutorDetail[] = TUTOR_MOCKS;
    staticPath = END_POINT.STATIC_PATH;
    public maxSize = 100;
    public directionLinks = true;
    public autoHide = false;
    public responsive = false;

    public config: PaginationInstance = {
        id: 'advanced',
        itemsPerPage: 10,
        currentPage: 1
    };


    params = {
        page: 1,
        pageSize: 10,
        role: 'TUTOR'
    };

    public labels: any = {
        previousLabel: 'Previous',
        nextLabel: 'Next',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };


    modalObject: any = {
        id: 'modalId',
        class: 'modal-custom-super-sm modal-dialog-top  modal-custom-xl',
        title: '',
        headerClass: 'myClass',
        textCancel: 'Cancel',
        textConfirm: 'Submit',
        hideFooter: false,
        ignoreBackdropClick: true,
        confirm: async () => {
            const body: UserDetail = this.form.getRawValue();
            console.log(body);

            let response: ApiResponse;
            if (body.id) {
                response = await this.tutorService.updateTutor(body);
            } else {
                body.role = 'TUTOR';
                body.groupPermission = this.selectedRole;
                body.department = this.selectedDepartment;
                response = await this.tutorService.createTutor(body);
            }
            if (response.isSuccess) {
                this.coreService.success('Create tutor successfully');
                this.getTutors(this.params);
                this.modalObject.hide();
                return;
            }
            if (response.errorCode === 1010) {
                this.coreService.error('Duplicate email');
                return;
            }
        },
        cancel: () => {
            this.modalObject.hide();
        },
    };
    isMultiSelected = false;

    groupPermissions: any[] = [];

    roles = [
        {
            value: 'STAFF',
            label: 'STAFF'
        },
        {
            value: 'STUDENT',
            label: 'STUDENT'
        },
        {
            value: 'TUTOR',
            label: 'TUTOR'
        },
    ];

    selectedDepartment: any;
    selectedRole: any;

    objectDetail = new UserDetail();
    form = new FormGroup({});
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private notifyService: NotifyService,
        private tutorService: TutorService,
        private coreService: AppCoreService
    ) {
        this.onCreateFormBuilder();
    }

    ngOnInit() {
        this.getTutors(this.params);
        this.getDeparments();
        this.getGroupPermissions();

    }

    openModal() {
    }

    async  getTutors(params) {
        const response = await this.tutorService.getTutors(params);
        this.sources = response.data.result;
        this.config.totalItems = response.data.totalCount;
        console.log(response);

    }

    onCreate() {
        this.objectDetail = new UserDetail();
        this.onCreateFormBuilder();
        this.modalObject.show();

    }

    onEdit(item: UserDetail) {
        this.objectDetail = item;
        this.onCreateFormBuilder();
        this.modalObject.show();


    }
    onView(item: TutorDetail) {
        this.router.navigate(['tutor/', item.id, 'view']);
    }

    onDelete(item: TutorDetail) {
        this.notifyService.comfirm().then(async (confirm) => {
            if (confirm.value) {
                const response = await this.coreService.deleteUser(item);
                if (response.status === 200) {
                    this.coreService.success('Delete tutor successfully');
                    this.getTutors(this.params);
                }
            } else {
                this.coreService.error('Delete tutor failure');
            }

        });
    }

    onSelectAll(event: any) {
        if (event.target.checked) {
            this.sources = this.sources.map((item) => ({ ...item, checked: true }));
            this.isMultiSelected = true;
        } else {
            this.sources = this.sources.map((item) => ({ ...item, checked: false }));
            this.isMultiSelected = false;
        }
    }
    onSelectStudent() {
        this.isMultiSelected = this.sources.filter(item => item.checked).length > 0 ? true : false;
    }

    onSelectTutor(data: TutorDetail) {

    }

    onCreateFormBuilder() {
        this.form = this.fb.group(
            {
                id: new FormControl({ value: this.objectDetail.id, disabled: false }, [Validators.required]),
                address: new FormControl(this.objectDetail.address, [Validators.required]),
                birthDate: new FormControl(this.objectDetail.birthDate, [Validators.required]),
                country: new FormControl(this.objectDetail.country, [Validators.required]),
                dateActivated: new FormControl(this.objectDetail.dateActivated, [Validators.required]),
                email: new FormControl(this.objectDetail.email, [Validators.required]),
                fullName: new FormControl(this.objectDetail.fullName, [Validators.required]),
                gender: new FormControl(this.objectDetail.gender, [Validators.required]),
                lastName: new FormControl(this.objectDetail.lastName, [Validators.required]),
                nationality: new FormControl(this.objectDetail.nationality, [Validators.required]),
                phoneNumber: new FormControl(this.objectDetail.phoneNumber, [Validators.required]),
                department: new FormControl(this.objectDetail.department, [Validators.required]),
                groupPermission: new FormControl(this.objectDetail.groupPermission, [Validators.required]),
                idCardType: new FormControl(this.objectDetail.idCardType, [Validators.required]),
                idCardNumber: new FormControl(this.objectDetail.idCardNumber, [Validators.required]),
                province: new FormControl(this.objectDetail.province, [Validators.required]),
                status: new FormControl(this.objectDetail.status, [Validators.required]),
                role: new FormControl(this.objectDetail.role, [Validators.required]),
                avatar: new FormControl(this.objectDetail.avatar, [Validators.required]),
            }
        );
    }

    onInitData() {
        this.sources = this.sources.map((item) => ({ ...item, checked: false }));
    }

    onPageChange(pageNumber) {
        this.config.currentPage = pageNumber;
        this.params.page = pageNumber;
        this.getTutors(this.params);
    }
    pageChanged(value) {
    }

    async fileChangeEvent(event) {
        const response = await this.coreService.uploadFile(event.target.files[0]);
        this.objectDetail.avatar = response.data.url;
        this.form.patchValue({
            avatar: response.data.fileName,
        });
    }

    async getDeparments() {
        const response = await this.coreService.getDepartments();
        this.selectedDepartment = response.data.result.find((department) => department.title.toLowerCase() === 'unknown');
        console.log(this.selectedDepartment);

    }

    async getGroupPermissions() {
        const response = await this.coreService.getRoles();
        this.groupPermissions = response.data.result;
        this.selectedRole = response.data.result.find((role) => role.description.toLowerCase() === 'tutor');
    }


    importData() {

    }

    exportData() {

    }


    async searchUser(value) {
        if (value) {
            console.log(value);
            const response = await this.coreService.getUserByEmail(value);
            this.sources = response.data.result.filter(user => user.role === 'TUTOR');
        } else {
            this.params.page = 1;
            this.getTutors(this.params);
        }

    }


    onReloadData(event) {
        this.params.page = 1;
        this.getTutors(this.params);
    }
}
