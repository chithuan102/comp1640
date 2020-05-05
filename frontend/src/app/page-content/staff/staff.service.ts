import { Injectable } from '@angular/core';
import { AppCoreService } from '@app/app.service';
import { END_POINT, METHOD_TYPE } from '@app/app.path';

@Injectable({ providedIn: 'root' })
export class StaffService {
    constructor(private coreService: AppCoreService) { }


    async getStaffs(params) {
        return await this.coreService.getUsers(params);
    }

    async getStaffDetail(id) {
        return await this.coreService.getUserDetail(id);
    }

    async createStaff(body) {
        return await this.coreService.createUser(body);
    }

    async updateStaff(body) {
        return await this.coreService.updateUser(body);
    }


    async getRoles() {
        return await this.coreService.getRoles();
    }

    async getDeparments() {
        return await this.coreService.getDepartments();
    }

    async deleteStaff(body) {
        return await this.coreService.deleteUser(body);
    }
}
