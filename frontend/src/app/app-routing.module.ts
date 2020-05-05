import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageContentComponent } from './page-content/page-content.component';
import { AuthenGuard } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { PermissionDenyComponent } from './errors/permission-deny/permission-deny.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenGuard],
    loadChildren: () => import('./page-content/page-content.module').then(m => m.PageContentModule)
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'error',
    component: PageContentComponent
  },
  {
    path: '**',
    component: PageContentComponent
  },
  {
    path: 'not-found',
    component: PageContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
