import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
// import { STAFF_MOCKS } from '../../staff.mock';
import { StaffDetail, Staff } from '../../staff.model';
import { NotifyService } from 'src/app/core/services/notify.service';
import { PaginationInstance } from 'ngx-pagination';
import { StaffService } from '../../staff.service';
import { UserDetail, ApiResponse } from '@app/app.models';
import { AppCoreService } from '@app/app.service';
import { END_POINT } from '@app/app.path';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  role = 'STAFF';
  sources: StaffDetail[] = [];
  avatar: File;

  staticPath = END_POINT.STATIC_PATH;
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
        response = await this.staffService.updateStaff(body);
      } else {
        body.role = 'STAFF';
        body.groupPermission = this.selectedRole;
        body.department = this.selectedDepartment;
        response = await this.staffService.createStaff(body);
      }
      if (response.isSuccess) {
        this.coreService.success('Create staff successfully');
        this.params.page = 1;
        this.getStaffs(this.params);
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
  isMultiSelected = false;

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
    role: 'STAFF'
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
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notifyService: NotifyService,
    private staffService: StaffService,
    private coreService: AppCoreService,

  ) {
    this.staticPath = END_POINT.STATIC_PATH;
    this.onCreateFormBuilder();
  }

  ngOnInit() {
    this.getStaffs(this.params);
    this.getDeparments();
    this.getGroupPermissions();
  }

  openModal() {
  }

  onCreate() {
    this.objectDetail = new StaffDetail();
    this.onCreateFormBuilder();
    this.modalObject.show();

  }

  onEdit(item: StaffDetail) {
    this.objectDetail = item;
    this.objectDetail.department = this.selectedDepartment;
    this.objectDetail.groupPermission = this.selectedRole;
    this.onCreateFormBuilder();
    this.modalObject.show();


  }
  onView(item: StaffDetail) {
    this.router.navigate(['staff/', item.id, 'view']);
  }

  onDelete(item: StaffDetail) {
    this.notifyService.comfirm().then(async (confirm) => {
      if (confirm.value) {
          const response = await this.coreService.deleteUser(item);
          if (response.status === 200) {
              this.coreService.success('Delete staff successfully');
              this.getStaffs(this.params);
          }
      } else {
          this.coreService.error('Delete staff failure');
      }

  });
  }

  onCreateFormBuilder() {
    this.form = this.fb.group(
      {
        id: new FormControl({ value: this.objectDetail.id, disabled: false }, [Validators.required]),
        address: new FormControl(this.objectDetail.address, [Validators.required]),
        birthDate: new FormControl(this.objectDetail.birthDate, [Validators.required]),
        country: new FormControl(this.objectDetail.country, [Validators.required]),
        dateActivated: new FormControl(this.objectDetail.dateActivated, [Validators.required]),
        email: new FormControl({ value: this.objectDetail.email, disabled: false }, [Validators.required]),
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
    this.getStaffs(this.params);
  }

  async getStaffs(params) {
    const response = await this.staffService.getStaffs(params);
    this.sources = response.data.result;
    this.config.totalItems = response.data.totalCount;

  }

  async getDeparments() {
    const response = await this.staffService.getDeparments();
    console.log(response);

    this.selectedDepartment = response.data.result.find((department) => department.title.toLowerCase() === 'unknown');
    console.log(this.selectedDepartment);

  }

  async getGroupPermissions() {
    const response = await this.staffService.getRoles();
    console.log(response);
    this.groupPermissions = response.data.result;
    this.selectedRole = response.data.result.find((role) => role.description.toLowerCase() === 'staff');
    console.log(this.selectedDepartment);

  }

  onChangeToggle(event) {
    console.log(event);

  }

  async fileChangeEvent(event) {
    const response = await this.coreService.uploadFile(event.target.files[0]);
    this.form.patchValue({
      avatar: response.data.fileName,
    });
  }

  onFileChange(ev) {
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


  importData() {

  }

  exportData() {

  }

  async searchUser(value) {
    if (value) {
      console.log(value);
      const response = await this.coreService.getUserByEmail(value);
      this.sources = response.data.result.filter(user => user.role === 'STAFF');
    } else {
      this.params.page = 1;
      this.getStaffs(this.params);
    }

  }


  onReloadData(event) {
    this.params.page = 1;
    this.getStaffs(this.params);
}

}
