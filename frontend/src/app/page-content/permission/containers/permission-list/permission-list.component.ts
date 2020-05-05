import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../../role.service';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {

  sources: any[] = [];

  constructor(private router: Router, private roleService: RoleService) { }

  ngOnInit(): void {
    this.getRoles();
  }


  onEdit() {

  }

  onView(item) {
    this.router.navigate(['/role/', item.id, 'view']);
  }

  onDelete() {

  }

  onCreate() {
    this.router.navigate(['/permission', 'create']);
  }

  onChangeStatus(value) {
    console.log(value);
  }

 async getRoles() {
   const response = await this.roleService.getRoles();
   this.sources = response.data.result;
   console.log(this.sources);
   
   
  }
}
