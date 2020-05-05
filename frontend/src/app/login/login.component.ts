import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppCoreService } from '@app/app.service';
import { UserService } from '@app/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  auth2: any;
  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;


  username = '';
  password;
  form = new FormGroup({});
  token: string;
  constructor(private router: Router, private fb: FormBuilder, private coreService: AppCoreService, private userService: UserService) {
    this.form = this.fb.group({
      username: this.username,
      password: ''
    });
  }

  ngOnInit(): void {
    // this.googleSDK();
  }

  async onLogin() {
    if (!this.form.controls.username.value) {
      this.coreService.error('Email is empty');
      return;
    }
    if (!this.form.controls.password.value) {
      this.coreService.error('Password is empty');
      return;
    }
    // const body = this.form.getRawValue();
    // console.log(body);
    const body = this.form.getRawValue();
    const response = await this.coreService.login(body);
    if (response.isSuccess) {
      this.token = response.data.token;
      localStorage.setItem('token', this.token);
      const responseUser = await this.coreService.getUserDetail(this.token.split('_', 1)[0]);

      const user = {
        ...responseUser.data,
        token: this.token.split('_').pop()
      };
      if (user.status === false) {
        this.coreService.error('Your account is blocked currently. Please contact your admin to get more about this action.');
        return;
      }
      localStorage.setItem('user', JSON.stringify(user));
      this.userService.setUser(user);
      this.router.navigate(['']).then(() => {
        this.coreService.success('Login successfully');
      });
    } else {
      this.coreService.error('User name/Password incorrect!');
    }

    // this.router.navigate(['']);
  }

  getUserInfo() {
    // this.coreService.getUserDetail(this.token.split())
  }


  prepareLoginButton() {

    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
        const profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        console.log(profile);
      }, (error) => {
        console.log(error);
      });

  }
  googleSDK() {
    const w = (window as any);
    w.googleSDKLoaded = () => {
      w.gapi.load('auth2', () => {
        this.auth2 = w.gapi.auth2.init({
          client_id: '715255882727-scquv1ra33vvpst1qo3b0nvrs8tupkrm.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
      });
    };
    ((d, s, id) => {
      let js: any = d.getElementsByTagName(s)[0];
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'google-jssdk');
  }

}
