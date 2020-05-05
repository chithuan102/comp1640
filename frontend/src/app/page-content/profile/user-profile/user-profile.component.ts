import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetail } from '@app/app.models';
import { UserService } from '@app/user.service';
import { AppCoreService } from '@app/app.service';
import { END_POINT } from '@app/app.path';
import { PaginationInstance } from 'ngx-pagination';
import { saveAs } from 'file-saver';
import { NotifyService } from '@app/core/services/notify.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  objectDetail = new UserDetail();
  isDisabledForm = true;
  departments;
  groupPermissions;
  documents;
  blogs;
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
    {
      value: 'ADMIN',
      label: 'ADMIN'
    },
  ];

  param = {

  }
  staticPath = END_POINT.STATIC_PATH;
  form = new FormGroup({});
  listStudents: any[] = [];
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

  public maxSize = 100;
  public directionLinks = true;
  public autoHide = false;
  public responsive = false;
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private coreService: AppCoreService,
    private notifyService: NotifyService
  ) {
    this.onCreateFormBuilder();
    this.userService.user.subscribe((user) => {
      this.objectDetail = user;
      this.getDeparments();
      this.getGroupPermissions();
      this.getUserDocuments();
      this.onCreateFormBuilder();
      this.getUserBlogs();
      this.params.tutorId = this.objectDetail.id;
      this.getStudentBuTutorId();
    });
  }

  ngOnInit(): void {
  }

  async getStudentBuTutorId() {
    const response = await this.coreService.getStudentByTutor(this.params);
    this.listStudents = response.data.result;

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
        tutor: new FormControl(this.objectDetail.tutor ? this.objectDetail.tutor.email : '', [Validators.required]),

      }
    );
    Object.keys(this.form.controls).forEach((controlName) => {
      this.form.controls[controlName].disable();
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
    this.blogs = response.data.result.filter((item) => item.type === 'BLOG');
  }

  async getUserBlogs() {
    const response = await this.coreService.getUserDocuments(this.objectDetail.id, 'BLOG');
    this.blogs = response.data.result.filter((item) => item.type === 'BLOG');
  }

  asyncUserBlog() {

  }


  onEdit() {
    this.isDisabledForm = !this.isDisabledForm;
    const state = this.isDisabledForm ? 'disable' : 'enable';
    Object.keys(this.form.controls).forEach((controlName) => {
      if (controlName !== 'id' && controlName !== 'email' && controlName !== 'role' && controlName !== 'department') {
        this.form.controls[controlName][state]();
      }
    });
  }
  async onSave() {
    const response = await this.coreService.updateUser(this.form.getRawValue());
    if (response.isSuccess) {

      this.coreService.success('Update info successfully');
      this.onEdit();
    } else {
      this.coreService.error('Save error!');
    }
  }


  async fileChangeEvent(event) {
    const response = await this.coreService.uploadFile(event.target.files[0]);
    this.staticPath = '';
    this.objectDetail.avatar = response.data.url;
    this.form.patchValue({
      avatar: response.data.fileName,
    });
  }


  onPageChange(pageNumber) {
    this.config.currentPage = pageNumber;
    this.params.page = pageNumber;
    this.getStudentBuTutorId();
  }


  downloadFile(item) {
    saveAs(this.staticPath + item.linkFile, item.linkFile);
  }

  async onDeleteBlog(item) {
    this.notifyService.comfirm().then(async (confirm) => {
      if (confirm.value) {
        const response = await this.coreService.deleteDocument(item.id);
        if (response.status === 200) {
          this.coreService.success('Delete blog successfully');
          this.getUserBlogs();
        }
      }
    })

  }
}
