import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppCoreService } from '@app/app.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  counter$: Observable<number>;
  count = 60;
  isClicked = false;
  isLoading = false;
  constructor(private coreService: AppCoreService) { }
  timeLeft = 0;
  interval;
  disabledResend = false;
  userEmail: string;
  password;
  confirmPassword;
  num1;
  num2;
  num3;
  num4;
  num5;
  num6;

  ngOnInit(): void {

  }

  async onSendCode() {

    if (!this.userEmail) {
      this.coreService.error('Email is empty');
      return;
    }
    this.isLoading = true;
    const response = await this.coreService.requestCode({ email: this.userEmail });
    if (response.isSuccess) {

      this.isClicked = true;
      this.startTimer();
      this.coreService.success('Send mail successfully. Please check you mail');
    } else {
      this.coreService.error('Send mail error');
    }
    this.isLoading = false;
  }

  startTimer() {
    this.timeLeft = 60;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.disabledResend = false;
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  sendNewCode() {
    this.disabledResend = false;
    clearInterval(this.interval);
    this.disabledResend = true;
    this.startTimer();
  }

  async onChangePassword() {
    if (!this.num1 || !this.num2 || !this.num3 || !this.num4 || !this.num5 || !this.num6) {
      this.coreService.error('Code not correct');
      return;
    }

    if (!this.password) {
      this.coreService.error('Password is empty');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.coreService.error('Password not matching');
      return;
    }

    const body = {
      code: Number.parseInt(`${this.num1}${this.num2}${this.num3}${this.num4}${this.num5}${this.num6}`, 10),
      newPassword: this.password,
      email: this.userEmail,
    };
    const response = await this.coreService.resetPassword(body);
    if (response.isSuccess) {
      this.coreService.success('Change password successfully', 'Success');
      this.password = '';
      this.confirmPassword = '';
      this.isClicked = false;
    } else {
      this.coreService.error('Change password error', 'Error');
    }



  }
}
