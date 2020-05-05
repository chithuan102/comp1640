import { Component, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { BlogObject, Blog } from '../blog/blog.model';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AppCoreService } from '@app/app.service';
import { ApiResponse } from '@app/app.models';
import { UserService } from '@app/user.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { END_POINT } from '@app/app.path';
@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  staticPath = END_POINT.STATIC_PATH;
  objectDetail = new BlogObject();
  currentUser;
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
      console.log(this.form);

      if (this.form.invalid) {
        this.coreService.error('Please fill full information');
        return;
      }
      const body: Blog = this.form.getRawValue();
      body.type = 'DOCUMENT';
      let response: ApiResponse;
      response = await this.coreService.createDocument(body);
      if (response.isSuccess) {
        this.coreService.success('Create blog success');
        this.form.reset();
      } else {
        this.coreService.success('Create blog failure');
      }
      this.modalObject.hide();
      this.getDocumentByUser();
    },
    cancel: () => {
      this.modalObject.hide();
    },
  };

  sources: any[] = [];

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

  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private coreService: AppCoreService,
    private userService: UserService,
    private http: HttpClient,
  ) {
    this.currentUser = this.userService.currentUser;
    this.onCreateFormBuilder();
    this.getDocumentByUser();
  }

  ngOnInit(): void {
  }

  onPageChange(event) {

  }


  onUploadDocument() {
    this.modalObject.show();
  }

  onCreateFormBuilder() {
    this.form = this.fb.group(
      {
        id: new FormControl({ value: this.objectDetail.id, disabled: false }),
        username: new FormControl(this.objectDetail.username),
        linkFile: new FormControl(this.objectDetail.linkFile, [Validators.required]),
        type: new FormControl(this.objectDetail.type),
        user: new FormControl(this.currentUser),
        description: new FormControl(this.objectDetail.description, [Validators.required]),

      }
    );
  }

  async fileChangeEvent(event) {
    console.log(event.target.files[0].type);

    switch (event.target.files[0].type) {
      case 'application/pdf':
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        console.log('file correct');
        const response = await this.coreService.uploadFile(event.target.files[0]);
        this.objectDetail.linkFile = response.data.url;
        this.form.patchValue({
          linkFile: response.data.fileName,
        });
        break;
      default:
        this.coreService.error('File invalid. Please submit only docx, xlsx');
        break;
    }

    // console.log(event);

  }

  async getDocumentByUser() {
    const response = await this.coreService.getUserDocuments(this.currentUser.id, 'DOCUMENT');
    console.log(response);
    // tslint:disable-next-line:max-line-length
    this.sources = response.data.result.filter((document) => document.type === 'DOCUMENT')
    // .map(document => ({ ...document, type: document.linkFile.split('.')[1] }));
    console.log(this.sources);

  }

  downloadFile(item) {
    saveAs(this.staticPath + item.linkFile, item.linkFile);
  }

}

