import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppCoreService } from '@app/app.service';
import { PaginationInstance } from 'ngx-pagination';
import { END_POINT } from '@app/app.path';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  constructor(
    private router: Router,
    private coreService: AppCoreService
  ) { }

  params = {
    page: 1,
    pageSize: 10,
    type: 'BLOG'
  };
  staticPath = END_POINT.STATIC_PATH;
  public maxSize = 100;
  public directionLinks = true;
  public autoHide = false;
  public responsive = false;
  public labels: any = {
    previousLabel: 'Previous',
    nextLabel: 'Next',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'page',
    screenReaderCurrentLabel: `You're on page`
  };

  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 10,
    currentPage: 1
  };

  listBlogs: any[] = [];

  ngOnInit(): void {
    this.getDocuments();
  }


  onCreate() {
    this.router.navigate(['blog/create']);
  }

  async getDocuments() {
    const response = await this.coreService.getDocuments(this.params);
    this.listBlogs = response.data.result;
    console.log(response);
  }


  onPageChange(pageNumber) {
    this.config.currentPage = pageNumber;
    this.params.page = pageNumber;
    this.getDocuments();
  }

  getBlogSearch(data) {
    this.listBlogs = data;
  }
}
