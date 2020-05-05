import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppCoreService } from '@app/app.service';

@Component({
  selector: 'app-blog-sidebar',
  templateUrl: './blog-sidebar.component.html',
  styleUrls: ['./blog-sidebar.component.scss']
})
export class BlogSidebarComponent implements OnInit {


  @Output() blogSearch = new EventEmitter<any>();
  constructor(private coreService: AppCoreService) { }

  ngOnInit(): void {
  }


  async searchBlog(searchText) {
    const response = await this.coreService.searchBlog(searchText);
    console.log(response);
    this.blogSearch.emit(response.data.result);

  }

}
