import { Injectable } from '@angular/core';
import { AppCoreService } from '@app/app.service';
import { END_POINT, METHOD_TYPE } from '@app/app.path';

@Injectable({ providedIn: 'root' })
export class StudentService {
    constructor(private coreService: AppCoreService) { }


    async getStudent(params) {
        return await this.coreService.getUsers(params);
    }

    async getStudentDetail(id) {
        return await this.coreService.getUserDetail(id);
    }

    async createStudent(body) {
        return await this.coreService.createUser(body);
    }

    async updateStudent(body) {
        return await this.coreService.updateUser(body);
    }
}
