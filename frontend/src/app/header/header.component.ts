import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@app/user.service';
import { User } from 'firebase';
import { UserDetail } from '@app/app.models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      this.user = user;
    });

  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
