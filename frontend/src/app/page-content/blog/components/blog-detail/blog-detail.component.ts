import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppCoreService } from '@app/app.service';
import { BlogObject } from '../../blog.model';
import { END_POINT } from '@app/app.path';
import { UserService } from '@app/user.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  objectDetail = new BlogObject();
  staticPath = END_POINT.STATIC_PATH;
  commentMessage: string;
  user;
  constructor(
    private route: ActivatedRoute,
    private coreService: AppCoreService,
    private userService: UserService,
  ) {
    this.route.params.subscribe((param) => {
      if (param.id) {
        this.getDocumentDetail(param.id);
      }
    });
    this.userService.user.subscribe((user) =>{
      this.user =user;
    })
  }

  ngOnInit(): void {
  }


  async getDocumentDetail(documentId) {
    const response = await this.coreService.getDocumentDetail(documentId);
    this.objectDetail = response.data;
    console.log(this.objectDetail);
  }

  async onSubmitComment() {
    const body = {
      name: this.user.email,
      content: this.commentMessage,
      parent: null,
      document: this.objectDetail

    };
    const response = await this.coreService.createComment(body);
    this.getDocumentDetail(this.objectDetail.id);
    this.commentMessage = '';
  }
}
