import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppCoreService } from './app.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthenGuard implements CanActivate {
  currentUser;

  constructor(private router: Router, private coreService: AppCoreService, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (!localStorage.getItem('token')) {
        this.router.navigate(['login']);
        return resolve(false);
      }
      await this.userService.user.subscribe(async (user) => {
        if (user === {} || user === null) {
          await this.userService.checkToken();
        }
        this.currentUser = user;
      });
      if (this.currentUser) {
        return resolve(true);
      }
      return resolve(false);
    });


  }
}
