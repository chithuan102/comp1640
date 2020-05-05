import { Injectable } from '@angular/core';
import { AppCoreService } from '@app/app.service';
import { END_POINT, METHOD_TYPE } from '@app/app.path';

@Injectable({ providedIn: 'root' })
export class TutorService {
    constructor(private coreService: AppCoreService) { }


    async getTutors(params) {
        return await this.coreService.getUsers(params);
    }

    async getTutorDetail(id) {
        return await this.coreService.getUserDetail(id);
    }

    async createTutor(body) {
        return await this.coreService.createUser(body);
    }

    async updateTutor(body) {
        return await this.coreService.updateUser(body);
    }
}