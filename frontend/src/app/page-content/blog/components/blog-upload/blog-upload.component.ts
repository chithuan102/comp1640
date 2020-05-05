import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { AppCoreService } from '@app/app.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Blog, BlogObject } from '../../blog.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@app/app.models';
import { NotifyService } from '@app/core/services/notify.service';
import { UserService } from '@app/user.service';
@Component({
  selector: 'app-blog-upload',
  templateUrl: './blog-upload.component.html',
  styleUrls: ['./blog-upload.component.scss']
})
export class BlogUploadComponent implements OnInit {
  ckeConfig = {
    allowedContent: false,
    extraPlugins: '',
    forcePasteAsPlainText: true
  };

  params = {
    page: 1,
    pageSize: 10,
    type: 'BLOG'
  }

  content: any;
  form: FormGroup;
  isEdit = false;

  objectDetail = new BlogObject();
  currentUser;
  constructor(
    private fb: FormBuilder,
    private coreService: AppCoreService,
    private route: ActivatedRoute,
    private router: Router,
    private notifySerivce: NotifyService,
    private userService: UserService,
  ) {
  
    this.currentUser = userService.currentUser;
    this.onCreateFormBuilder();
    this.route.params.subscribe((param) => {
      if (param.id) {
        this.isEdit = true;
        this.getBlogDetail(param.id);
      }
    });

  }

  ngOnInit(): void {
  }


  onCreate() {

  }

  onBack() {
    window.history.back();
  }


  async getBlogDetail(id) {
    const response = await this.coreService.getDocumentDetail(id);
    console.log(response);
    this.objectDetail = response.data;
    setTimeout(() => {
      this.onCreateFormBuilder();
    }, 200);

  }



  onCreateFormBuilder() {
    this.form = this.fb.group(
      {
        id: new FormControl({ value: this.objectDetail.id, disabled: false }),
        title: new FormControl(this.objectDetail.title, [Validators.required]),
        content: new FormControl(this.objectDetail.content, [Validators.required]),
        description: new FormControl(this.objectDetail.description),
        thumbnail: new FormControl(this.objectDetail.thumbnail),
        shortDescription: new FormControl(this.objectDetail.shortDescription, [Validators.required]),
        username: new FormControl(this.objectDetail.username),
        linkFile: new FormControl(this.objectDetail.linkFile),
        type: new FormControl(this.objectDetail.type),
        user: new FormControl(this.currentUser),
        comments: new FormControl(this.objectDetail.comments),

      }
    );
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.coreService.error('Please fill full information');
      return;
    }
    const body: Blog = this.form.getRawValue();
    body.type = 'BLOG';
    body.username = this.currentUser.email;
    let response: ApiResponse;
    if (this.isEdit) {
      response = await this.coreService.updateDocument(body);
    } else {
      response = await this.coreService.createDocument(body);
    }
    if (response.isSuccess) {
      this.coreService.success('Create blog success');
      this.form.reset();
    } else {
      this.coreService.success('Create blog failure');
    }


  }

  async onDeleteDocument(id) {
    this.notifySerivce.comfirm().then(async (confirm) => {
      if (confirm.value) {
        const response = await this.coreService.deleteDocument(id);
        if (response.isSuccess) {
          this.coreService.success('Delete document successfully');
          window.history.back();
        } else {
          this.coreService.error('Delete document error');
        }
      }
    });
  }


  async fileChangeEvent(event) {
    const response = await this.coreService.uploadFile(event.target.files[0]);
    this.form.patchValue({
      thumbnail: response.data.fileName,
    });
  }
}
