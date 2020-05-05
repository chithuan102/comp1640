import { Injectable } from '@angular/core';
import { AppCoreService } from '@app/app.service';
import { MethodType } from '@app/app.models';
import { END_POINT, METHOD_TYPE } from '@app/app.path';

@Injectable({ providedIn: 'root' })
export class RoleService {
    constructor(private appService: AppCoreService) {
    }

    async getRoles() {
        return await this.appService.callApi(END_POINT.ROLE.GET_ROLES, METHOD_TYPE.GET);
    }

    async getRoleDetail(id) {
        return await this.appService.callApi(END_POINT.ROLE.GET_DETAIL + id, METHOD_TYPE.GET);
    }

    async updateRole(body) {
        return await this.appService.callApi(END_POINT.ROLE.GET_DETAIL + body.id, METHOD_TYPE.PUT,body);
    }
}