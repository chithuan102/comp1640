import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve) => {
      let user;
      this.userService.user.subscribe((data) => {
        user = data;
      });
      console.log(user);
      
      const role = route.data.role;
      if (role && !role.includes(user.role)) {
        // Redirect to login page
        await this.router.navigateByUrl('no-permission');
        return resolve(false);
      }
      return resolve(true);
    });
  }
}
