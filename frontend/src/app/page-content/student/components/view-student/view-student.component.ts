import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { STUDENT_MOCKS } from '../../student.mock';
import { StudentDetail, Student } from '../../student.model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotifyService } from 'src/app/core/services/notify.service';
import { UserDetail } from '@app/app.models';
import { AppCoreService } from '@app/app.service';
import { END_POINT } from '@app/app.path';
import { async } from '@angular/core/testing';
import { Blog } from '@app/page-content/blog/blog.model';
import { Subscription, Subject, of, Observable, concat } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.scss']
})
export class ViewStudentComponent implements OnInit {
  newPassword;
  confirmPassword;

  listTutors$: Observable<any>;
  userInput$ = new Subject<string>();
  isFetchingTutor = false;
  modalObject: any = {
    id: 'modalId',
    class: 'modal-custom-super-sm modal-dialog-top  modal-custom-sm',
    title: '',
    headerClass: 'myClass',
    textCancel: 'Cancel',
    textConfirm: 'Submit',
    hideFooter: false,
    ignoreBackdropClick: true,
    confirm: async () => {
      if (!this.newPassword) {
        this.coreService.error('Password must not blank');
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.coreService.error('New password and confirm password not matched');
        return;
      }
      this.form.patchValue({
        password: this.newPassword
      });
      const response = await this.coreService.updateUser(this.form.getRawValue());
      if (response.status === 200) {
        this.coreService.success('Update password successfully');
        this.modalObject.hide();
      } else {
        this.coreService.error('Update password failure');
      }

    },
    cancel: () => {
      this.modalObject.hide();
    },
  };
  objectDetail = new UserDetail();
  isDisabledForm = true;
  form = new FormGroup({});
  documents: Blog[] = [];
  blogs: Blog[] = [];

  majorItems = [
    {
      value: 'IT',
      title: 'IT'
    },
    {
      value: 'Design',
      title: 'Design'
    },
    {
      value: 'Business',
      title: 'Business'
    },
    {
      value: 'Unknown',
      title: 'Unknown'
    }
  ];

  staticPath = END_POINT.STATIC_PATH;
  radioSettings = [
    { value: 'Male', title: 'Male' },
    { value: 'Female', title: 'Female' },
  ];
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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private notifyService: NotifyService,
    private router: Router,
    private coreService: AppCoreService,
  ) {
    this.onCreateFormBuilder();
    this.route.params.subscribe(param => {
      if (param.id) {
        this.getStudentDetail(param.id);

      }
    });
  }

  ngOnInit(): void {
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

  async getStudentDetail(id) {
    this.coreService.getUserDetail(id).then((response) => {
      this.objectDetail = response.data;
      this.getUserDocuments();
      this.onCreateFormBuilder();
      this.getUserBlogs();

    });
  }

  onSubmit() {
    const isFormValid: boolean = this.form.status.toLowerCase() === 'valid' ? true : false;
    if (!isFormValid) {
      alert('Form invalid');
      return;
    }
    const rawData = this.form.getRawValue();
  }

  onCancel() {
    window.history.back();
  }
  onEdit() {
    this.isDisabledForm = !this.isDisabledForm;
    const state = this.isDisabledForm ? 'disable' : 'enable';
    Object.keys(this.form.controls).forEach((controlName) => {
      if (controlName !== 'id') {
        this.form.controls[controlName][state]();
      }
    });
  }
  async onSave() {
    const response = await this.coreService.updateUser(this.form.getRawValue());
    if (response.isSuccess) {

      this.toastService.success('Save successfully!', 'Student');
      this.onEdit();
    } else {
      this.coreService.error('Save error!');
    }
  }

  onDelete() {
    this.notifyService.comfirm().then(async (confirm) => {
      if (confirm.value) {
        await this.coreService.deleteUser(this.form.getRawValue());
        this.router.navigate(['student']);
      }
    });
  }

  onBack() {
    window.history.back();
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
        tutor: new FormControl(this.objectDetail.tutor, [Validators.required]),
        password: new FormControl(this.objectDetail.password, [Validators.required]),
      }
    );
    Object.keys(this.form.controls).forEach((controlName) => {
      this.form.controls[controlName].disable();
    });
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

  }

  async getGroupPermissions() {
    const response = await this.coreService.getRoles();
    this.groupPermissions = response.data.result;
  }

  async getUserDocuments() {
    const response = await this.coreService.getUserDocuments(this.objectDetail.id, 'DOCUMENT');
    this.documents = response.data.result.filter((item) => item.type === 'DOCUMENT');
  }

  async getUserBlogs() {
    const response = await this.coreService.getUserDocuments(this.objectDetail.id, 'BLOG');
    this.blogs = response.data.result.filter((item) => item.type === 'BLOG');
  }


  async onDeleteDocument(id) {
    this.notifyService.comfirm().then(async (confirm) => {
      if (confirm.value) {
        const response = await this.coreService.deleteDocument(id);
        if (response.isSuccess) {
          this.coreService.success('Delete document successfully');
          this.getUserDocuments();
        } else {
          this.coreService.error('Delete document error');
        }
      }
    });
  }
  onChangePassword() {
    this.modalObject.show();
  }
  onSelectTutor(data){
    this.form.patchValue({
      tutor: data
    });
  }
}
