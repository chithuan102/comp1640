import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiResponse, MethodType } from './app.models';
import { END_POINT, METHOD_TYPE } from './app.path';
import { ToastrService } from 'ngx-toastr';
export const getResponseData = (response: any): ApiResponse => {
    const { ErrorCode, StatusCode, Response } = response;
    return {
        data: Response,
        status: StatusCode,
        hasError: ErrorCode,
        isSuccess: !ErrorCode && StatusCode === 200,
        errorCode: ErrorCode
    };
};
export const getResponseError = (response: any): ApiResponse => {
    const { status, data } = response;
    return {
        status,
        data,
    };
};
@Injectable({ providedIn: 'root' })
export class AppCoreService {

    host = 'http://api.com1640.tk';
    // host = 'http://localhost:8888';

    constructor(private http: HttpClient, private toastService: ToastrService) { }

    public callApi(path: string, method: string, requestData?: any): Promise<ApiResponse> {
        let options: any;
        if (method === 'GET') {
            options = {
                params: requestData
            };
        } else {
            options = {
                body: requestData
            };
        }

        return new Promise((resolve, reject) => {
            this.http
                .request<any>(method, this.host + path, options)
                .toPromise()
                .then(response => {
                    return resolve(getResponseData(response));
                })
                .catch((error: any) => {
                    return reject(getResponseError(error));
                });
        });
    }

    async getUsers(params) {
        return await this.callApi(END_POINT.USER.GET_DETAIL, METHOD_TYPE.GET, params);
    }

    async getUserDetail(id) {
        return await this.callApi(END_POINT.USER.GET_DETAIL + id, METHOD_TYPE.GET);
    }

    async createUser(body) {
        return await this.callApi(END_POINT.USER.CREATE, METHOD_TYPE.POST, body);
    }

    async updateUser(body) {
        return await this.callApi(END_POINT.USER.UPDATE + body.id, METHOD_TYPE.PUT, body);
    }

    async deleteUser(body) {
        return await this.callApi(END_POINT.USER.DELETE + body.id, METHOD_TYPE.DELETE);
    }

    async getDepartments() {
        return await this.callApi(END_POINT.DEPARMENT.GET, METHOD_TYPE.GET);
    }

    async getRoles() {
        return await this.callApi(END_POINT.ROLE.GET_ROLES, METHOD_TYPE.GET);
    }

    uploadFile(file: File): Promise<ApiResponse> {
        const fromData = new FormData();
        fromData.append('file', file);
        return new Promise((resolve, reject) => {
            this.http
                .post(this.host + '/upload', fromData)
                .toPromise()
                .then(response => {
                    return resolve(getResponseData(response));
                })
                .catch((error: any) => {
                    return reject(getResponseError(error));
                });
        });
    }

    async createDocument(body) {
        return await this.callApi(END_POINT.DOCUMENT.CREATE, METHOD_TYPE.POST, body);
    }

    async getDocumentDetail(documentId) {
        return await this.callApi(END_POINT.DOCUMENT.GET_DETAIL + documentId, METHOD_TYPE.GET);
    }

    async getUserDocuments(userId, type) {
        return await this.callApi('/users/' + userId + '/documents/' + type, METHOD_TYPE.GET);
    }

    async updateDocument(body) {
        return await this.callApi(END_POINT.DOCUMENT.UPDATE + body.id, METHOD_TYPE.PUT, body);
    }

    async getDocuments(params) {
        return await this.callApi(END_POINT.DOCUMENT.GET, METHOD_TYPE.GET, params);
    }

    async deleteDocument(id) {
        return await this.callApi(END_POINT.DOCUMENT.DELETE + id, METHOD_TYPE.DELETE);
    }


    async createComment(body) {
        return await this.callApi(END_POINT.COMMENT.CREATE, METHOD_TYPE.POST, body);
    }

    async login(body) {
        return await this.callApi('/login', METHOD_TYPE.POST, body);
    }


    async changePasswordByOldPasword(body) {
        return await this.callApi('/change-password', METHOD_TYPE.POST, body);
    }



    async requestCode(body) {
        return await this.callApi('/requestCode', METHOD_TYPE.POST, body);
    }

    async resetPassword(body) {
        return await this.callApi('/resetPassword', METHOD_TYPE.POST, body);
    }


    async getStudentNoTutor(params) {
        return await this.callApi('/reports/no-tutor', METHOD_TYPE.GET, params);
    }
    async getStudentUnActive(params) {
        return await this.callApi('/reports/unactive', METHOD_TYPE.GET, params);
    }
    async getUserByEmail(params) {
        if (!params) {
            params = 'qwertyuozxc';
        }
        return await this.callApi('/users/email/' + params, METHOD_TYPE.GET);
    }

    async getStudentNotInteractive(params) {
        return await this.callApi('/unactive', METHOD_TYPE.GET, params);
    }

    async getStudentByTutor(params) {
        return await this.callApi('/students', METHOD_TYPE.GET, params);
    }


    async createMeeting(body) {
        return await this.callApi('/meetings', METHOD_TYPE.POST, body);
    }

    async updateMeeting(body) {
        return await this.callApi('/meetings/' + body.id, METHOD_TYPE.PUT, body);
    }

    async getMeetings(id) {
        return await this.callApi('/users/' + id + '/meetings', METHOD_TYPE.GET);
    }

    async getMeeting(id) {
        return await this.callApi('/meetings/' + id, METHOD_TYPE.GET);
    }

    async deleteMeeting(id) {
        return await this.callApi('/meetings/' + id, METHOD_TYPE.DELETE);
    }


    async export(role) {
        return await this.callApi('/export/users', METHOD_TYPE.GET, role);
    }

    async import(data) {
        return await this.callApi('/import/users', METHOD_TYPE.POST, data);
    }


    async searchBlog(searchText) {
        return await this.callApi('/documents/blog/search', METHOD_TYPE.GET, { searchText });
    }


    success(message?, title?) {
        this.toastService.success(message ? message : 'Success', title ? title : 'Notify');
    }


    error(message?, title?) {
        this.toastService.error(message ? message : 'Invalid', title ? title : 'Notify');
    }

    async sendMail(body) {
        return await this.callApi('/send-mail', METHOD_TYPE.POST,  body);
    }

}
