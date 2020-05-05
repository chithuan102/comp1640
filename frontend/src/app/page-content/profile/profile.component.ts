import { Component, OnInit } from '@angular/core';
import { AppCoreService } from '@app/app.service';
import { UserService } from '@app/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  oldPassword;
  newPassword;
  confirmPassword;
  user;
  constructor(private coreService: AppCoreService, private userService: UserService, private router: Router) {
    this.userService.user.subscribe((user) => {
      this.user = user;
    })
  }

  ngOnInit(): void {
  }

  async onChangePassword() {
    if (!this.oldPassword) {
      return;
    }
    if (!this.newPassword) {
      return;
    }
    if (!this.confirmPassword) {
      return;
    }

    if (this.newPassword === this.confirmPassword) {
      const body = {
        oldPassword: this.oldPassword,
        password: this.newPassword,
        email: this.user.email
      };
      const response = await this.coreService.changePasswordByOldPasword(body);
      if (response.isSuccess) {
        this.router.navigate(['login']).then(() => this.coreService.success('Change password successfully. Please login again'));
        localStorage.clear();
      }

    }
  }

}
