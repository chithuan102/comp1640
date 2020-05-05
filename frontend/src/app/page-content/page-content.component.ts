import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-content',
  template: `
  <!-- BEGIN: Header-->
  <app-header></app-header>
  <!-- END: Header-->
  <!-- BEGIN: Main Menu-->
  <app-sidebar></app-sidebar>
  <!-- END: Main Menu-->
  <!-- START CONTENT -->
  <app-box-content>
    <router-outlet></router-outlet>
  </app-box-content>
  <!-- END CONTENT -->`,
})
export class PageContentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
