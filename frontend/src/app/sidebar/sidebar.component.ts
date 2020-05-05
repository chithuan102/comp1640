import { Component, OnInit } from '@angular/core';
import { AppCoreService } from '@app/app.service';
import { UserService } from '@app/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  settings: any = [
    {
      title: 'Dashboard',
      role: [],
      icon: 'feather icon-home',
      link: '/dashboard'
    },
    // {
    //   title: 'Role',
    //   role: ['ADMIN'],
    //   icon: 'fa fa-key',
    //   link: '/role'
    // },
    {
      title: 'Staff',
      role: ['ADMIN'],
      icon: 'fa fa-users',
      link: '/staff'
    },
    {
      title: 'Tutor',
      role: ['ADMIN', 'STAFF'],
      icon: 'fa fa-users',
      link: '/tutor'
    },
    {
      title: 'Student',
      role: ['ADMIN', 'STAFF', 'TUTOR'],
      icon: 'fa fa-users',
      link: '/student'
    },
    {
      title: 'Blog',
      role: [],
      icon: 'fa fa-newspaper-o',
      link: '/blog'
    },
    {
      title: 'Meeting',
      role: [],
      icon: 'fa fa-calendar',
      link: '/meeting'
    },
    {
      title: 'Message',
      role: ['STUDENT', 'TUTOR'],
      icon: 'fa fa-comments',
      link: '/message'
    },
    {
      title: 'Document',
      role: ['STUDENT'],
      icon: 'fa fa-file',
      link: '/upload-document'
    },
  ];
  constructor(private coreService: AppCoreService, public userService: UserService) { }

  ngOnInit(): void {
  }

}
