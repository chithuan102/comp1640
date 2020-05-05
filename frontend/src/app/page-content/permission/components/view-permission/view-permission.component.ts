import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../role.service';

@Component({
  selector: 'app-view-permission',
  templateUrl: './view-permission.component.html',
  styleUrls: ['./view-permission.component.scss']
})
export class ViewPermissionComponent implements OnInit {
  isDisabledForm = true;
  objectDetail: any;
  constructor(
    private router: Router,
    private roleService: RoleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      console.log(param);
      if (param.id) {
        this.getRoleDetail(param.id);
      }
    });

  }

  onBack() {
    this.router.navigate(['/role']);
  }
  onDelete() {

  }

  async getRoleDetail(id) {
    const response = await this.roleService.getRoleDetail(id);
    this.objectDetail = response.data;
    console.log(this.objectDetail);


  }

  onSave() {
    this.roleService.updateRole(this.objectDetail);

  }

  onEdit() {

  }

  onChangeStatus(event) {
    this.objectDetail.status = event;
    console.log(event);

  }
}
