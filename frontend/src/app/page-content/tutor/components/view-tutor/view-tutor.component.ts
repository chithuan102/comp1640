import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TUTOR_MOCKS } from '../../tutor.mock';
import { TutorDetail, Tutor } from '../../tutor.model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotifyService } from 'src/app/core/services/notify.service';
import { TutorService } from '../../tutor.service';
import { UserDetail } from '@app/app.models';
import { END_POINT } from '@app/app.path';
import { AppCoreService } from '@app/app.service';
import { PaginationInstance } from 'ngx-pagination';
import { Blog } from '@app/page-content/blog/blog.model';

@Component({
  selector: 'app-view-tutor',
  templateUrl: './view-tutor.component.html',
  styleUrls: ['./view-tutor.component.scss']
})
export class ViewTutorComponent implements OnInit {
  newPassword;
  confirmPassword;
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

  listStudents: any[] = [];
  radioSettings = [
    { value: 'Male', title: 'Male' },
    { value: 'Female', title: 'Female' },
  ];
  gender;
  staticPath = END_POINT.STATIC_PATH;

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
    tutorId: 0
  };

  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: ToastrService,
    private notifyService: NotifyService,
    private tutorService: TutorService,
    private router: Router,
    private coreService: AppCoreService,
  ) {
    this.onCreateFormBuilder();
    this.route.params.subscribe(param => {
      if (param.id) {
        this.params.tutorId = param.id;
        this.getTutorDetail(param.id);
        this.getStudentBuTutorId();
        
      }
    });
  }

  blogs: Blog[] = [];

  ngOnInit(): void {
    this.getGroupPermissions();
  }

  async getUserBlogs() {
    const response = await this.coreService.getUserDocuments(this.objectDetail.id, 'BLOG');
    this.blogs = response.data.result.filter((item) => item.type === 'BLOG');
  }
  async getTutorDetail(id) {
    this.tutorService.getTutorDetail(id).then((response) => {
      this.objectDetail = response.data;
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
    await this.coreService.updateUser(this.form.getRawValue());
    this.toastService.success('Save successfully!', 'Tutor');

    this.onEdit();
  }

  onDelete() {
    this.notifyService.comfirm().then(async (confirm) => {
      if (confirm.value) {
        await this.coreService.deleteUser(this.objectDetail);
        this.router.navigate(['tutor']);
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


  async getGroupPermissions() {
    const response = await this.coreService.getRoles();
    this.groupPermissions = response.data.result;
  }

  async getStudentBuTutorId() {
    const response = await this.coreService.getStudentByTutor(this.params);
    this.listStudents = response.data.result;

  }

  onPageChange(pageNumber) {
    this.config.currentPage = pageNumber;
    this.params.page = pageNumber;
    this.getStudentBuTutorId();
  }

  onChangePassword() {
    this.modalObject.show();
  }


  onUnassignStudent(item) {
    this.notifyService.comfirm().then(confirm => {
      if (confirm.value) {
        const body = {
          ...item,
          tutor: null,
        };
        this.coreService.updateUser(body);
        this.coreService.success('Remove assign student successfully');
        this.getStudentBuTutorId();
      }
    });
  }

  async onDeleteDocument(id) {
    this.notifyService.comfirm().then(async (confirm) => {
      if (confirm.value) {
        const response = await this.coreService.deleteDocument(id);
        if (response.isSuccess) {
          this.coreService.success('Delete document successfully');
          this.getUserBlogs();
        } else {
          this.coreService.error('Delete document error');
        }
      }
    });
  }
}
