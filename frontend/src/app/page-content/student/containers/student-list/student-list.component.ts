import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { StudentDetail } from '../../student.model';
import { STUDENT_MOCKS } from '../../student.mock';
import { TUTOR_MOCKS } from '../../../tutor/tutor.mock';
import { NotifyService } from 'src/app/core/services/notify.service';
import { TutorDetail } from 'src/app/page-content/tutor/tutor.model';
import { UserDetail, ApiResponse } from '@app/app.models';
import { AppCoreService } from '@app/app.service';
import { END_POINT } from '@app/app.path';
import { PaginationInstance } from 'ngx-pagination';
import { Subscription, Subject, of, Observable, concat } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { UserService } from '@app/user.service';

@Component({
    selector: 'app-students-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit, AfterViewInit {
    sources: UserDetail[] = [];
    listTutors: UserDetail[] = [];
    majorItems: any[] = [];
    staticPath = END_POINT.STATIC_PATH;
    listTutors$: Observable<any>;
    userInput$ = new Subject<string>();
    isFetchingTutor = false;

    role = 'STUDENT';

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
            if (!body.department) {
                this.coreService.error('Please select department', 'Invalid');
                return;
            }

            let response: ApiResponse;
            if (body.id) {
                response = await this.coreService.updateUser(body);
            } else {
                body.role = 'STUDENT';
                body.groupPermission = this.selectedRole;
                response = await this.coreService.createUser(body);
            }
            if (response.isSuccess) {
                this.coreService.success('Create student successfully');
                this.getStudent(this.params);
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
    selectedTutor: UserDetail;
    selectedStudents: UserDetail[] = [];
    isMultiSelected = false;

    groupPermissions: any[] = [];
    departments: any[] = [];

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

    assignModalObject: any = {
        id: 'modalId',
        class: 'modal-custom-super-sm modal-dialog-top  modal-custom-sm',
        title: 'Assign tutor',
        headerClass: 'myClass',
        textCancel: 'Cancel',
        textConfirm: 'OK',
        hideFooter: false,
        ignoreBackdropClick: true,
        confirm: async () => {
            if (this.sources.filter(item => item.checked).length === 0) {
                alert('No student selected');
            }
            this.selectedStudents = this.sources.filter(item => item.checked);
            this.selectedStudents = this.selectedStudents.map(item => {
                return {
                    ...item,
                    tutor: this.selectedTutor
                };
            });
            const promises = await this.selectedStudents.map(async item => await this.coreService.updateUser(item));
            Promise.all(promises).then((responses) => {
                responses.forEach((response) => {
                    if (response.isSuccess) {
                        this.coreService.success(`Assign tutor for student ${response.data.email} successfully`);
                        const sendMailBody = {
                            email: response.data.email,
                            text: 'You has been assigned to tutor ' + `${this.selectedTutor.fullName} - ${this.selectedTutor.email}`
                        };
                        const sendMailBodyTutor = {
                            email: this.currentUser.email,
                            // tslint:disable-next-line: max-line-length
                            text: 'Student ' + response.data.email + ' has been assigned to you by ' + `${this.currentUser.fullName} - ${this.currentUser.email}`
                        };
                        this.coreService.sendMail(sendMailBody);
                        this.coreService.sendMail(sendMailBodyTutor);

                    }
                });
                this.onInitData();
                this.getStudent(this.params);
                this.assignModalObject.hide();

            });


        },
        cancel: () => {
            this.assignModalObject.hide();
        },
    };

    selectedDepartment: any;
    selectedRole: any;

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
        role: 'STUDENT'
    };

    public labels: any = {
        previousLabel: 'Previous',
        nextLabel: 'Next',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };

    objectDetail = new UserDetail();
    form = new FormGroup({});
    currentUser;
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private notifyService: NotifyService,
        private coreService: AppCoreService,
        private userService: UserService,

    ) {
        this.currentUser = this.userService.currentUser;
        this.onCreateFormBuilder();
        this.listTutors$ = concat(
            of([]), // default items
            this.userInput$.pipe(
                debounceTime(500),
                distinctUntilChanged(),
                tap(() => {
                    this.isFetchingTutor = true;
                }),
                switchMap(term =>
                    this.coreService.getUserByEmail(term)
                        .then(res => res.data.result.filter(user => user.role === 'TUTOR'))
                        .finally(() => {
                            this.isFetchingTutor = false;
                        })
                )));
    }

    ngOnInit() {
        this.getDeparments();
        this.getGroupPermissions();
        this.getStudent(this.params);

    }

    async  getStudent(params) {
        const response = await this.coreService.getUsers(params);
        this.sources = response.data.result;
        this.config.totalItems = response.data.totalCount;
        console.log(response);

    }

    openModal() {
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
    onView(item: StudentDetail) {
        this.router.navigate(['student/', item.id, 'view']);
    }

    onDelete(item: StudentDetail) {
        // this.confirmDeleteModal.show();
        this.notifyService.comfirm().then(async (confirm) => {
            if (confirm.value) {
                const response = await this.coreService.deleteUser(item);
                if (response.status === 200) {
                    this.coreService.success('Delete student successfully');
                    this.getStudent(this.params);
                }
            } else {
                this.coreService.error('Delete sutdent failure');
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
    onSelectStudent(data: UserDetail, index) {
        this.sources[index] = data;
        // this.selectedStudents = this.sources.filter((item) => item.checked);
        // console.log(this.selectedStudents);


    }

    onAssignTutor() {
        this.selectedStudents = this.sources.filter(item => item.checked);
        if (this.selectedStudents.length === 0) {
            this.coreService.error('No student selected');
            return;
        }
        if (this.currentUser.role === 'TUTOR') {
            const abc = this.selectedStudents.find((student) => student.tutor);
            if (abc) {
                this.coreService.error('You can cannot assign student already had a tutor');
                return;
            }
            this.notifyService.comfirmAssignToMe().then(async (confirm) => {
                if (confirm.value) {
                    this.selectedStudents = this.sources.filter(item => item.checked);
                    this.selectedStudents = this.selectedStudents.map(item => {
                        return {
                            ...item,
                            tutor: this.currentUser
                        };
                    });
                    const promises = await this.selectedStudents.map(async item => await this.coreService.updateUser(item));
                    Promise.all(promises).then((responses) => {
                        responses.forEach((response) => {
                            if (response.isSuccess) {
                                this.coreService.success(`Assign tutor for student ${response.data.email} successfully`);
                                const sendMailBody = {
                                    email: response.data.email,
                                    text: 'You has been assigned to tutor ' + this.currentUser.email
                                };
                                this.coreService.sendMail(sendMailBody);
                            }
                        });
                        this.onInitData();
                        this.getStudent(this.params);
                        this.assignModalObject.hide();

                    });
                }
            });
        } else {
            this.assignModalObject.show();
        }


    }

    onSelectTutor(data: UserDetail) {
        this.selectedTutor = data;


    }
    ngAfterViewInit() {
        // this.modal.showModal();
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

    onChangeMajor(data) {

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
        this.departments = response.data.result;
        // this.selectedDepartment = response.data.result.find((department) => department.title.toLowerCase() === 'unknown');

    }

    async getGroupPermissions() {
        const response = await this.coreService.getRoles();
        this.groupPermissions = response.data.result;
        this.selectedRole = response.data.result.find((role) => role.description.toLowerCase() === 'student');
    }

    onPageChange(pageNumber) {
        this.config.currentPage = pageNumber;
        this.params.page = pageNumber;
        this.getStudent(this.params);
    }
    pageChanged(value) {
    }


    importData(ev) {
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];
        reader.onload = (event) => {
            const data = reader.result;
            workBook = XLSX.read(data, { type: 'binary' });
            jsonData = workBook.SheetNames.reduce((initial, name) => {
                const sheet = workBook.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
            }, {});
            const dataString = JSON.stringify(jsonData);
            // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
            // this.setDownload(dataString);
        }
        reader.readAsBinaryString(file);

    }

    exportData() {
        alert('Clicked');
        document.getElementById('');
    }



    async searchUser(value) {
        if (value) {
            console.log(value);
            const response = await this.coreService.getUserByEmail(value);
            this.sources = response.data.result.filter(user => user.role === 'STUDENT');
        } else {
            this.params.page = 1;
            this.getStudent(this.params);
        }

    }


    onReloadData(event) {
        this.params.page = 1;
        this.getStudent(this.params);
    }


}
