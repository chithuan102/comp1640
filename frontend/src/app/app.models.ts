export enum MethodType {
    GET,
    PUST,
    POST,
    DELETE,
}

export interface ApiResponse {
    code?: string;
    data?: any;
    message?: string;
    status?: any;
    hasError?: boolean;
    isSuccess?: boolean;
    errorCode?: any;
}

export interface User {
    firstName?: string;
    lastName?: string;
    address?: string;
    gender?: string;
    birthDate?: string;
    email?: string;
    phoneNumber?: string;
    province?: string;
    country?: string;
    nationality?: string;
    dateActivated?: string;
    id?: number;
    checked?: boolean;
    displayName?: string;
    idCardType?: string;
    idCardNumber?: string;
    isActivated?: boolean;
    status?: boolean;
    fullName?: string;
    tutor?: string;
    password?: string;
}

export class UserDetail implements User {
    constructor(
        public id?: number,
        public avatar?: string,
        public birthDate?: string,
        public email?: string,
        public firstName?: string,
        public lastName?: string,
        public gender?: string,
        public hometown?: string,
        public role?: string,
        public department?: any,
        public groupPermission?: any,
        public checked?: boolean,
        public address?: string,
        public phoneNumber?: string,
        public nationality?: string,
        public country?: string,
        public idCardType?: string,
        public idCardNumber?: string,
        public province?: string,
        public dateActivated?: string,
        public isActivated?: boolean,
        public status?: boolean,
        public fullName?: string,
        public tutor?: any,
        public password?: string,

    ) { }
}
export interface Meeting {
    id?: any;
    time?: any;
    place?: any;
    type?: any;
    topic?: any;
    notes?: any;
    start?: any;
    end?: any;
    creater?;
    inviter?;
    status?: boolean;
}


export class MeetingObject implements Meeting{
    constructor(
        public id?: any,
        public time?: any,
        public place?: any,
        public type?: any,
        public topic?: any,
        public notes?: any,
        public start?: any,
        public end?: any,
        public creater?: any,
        public inviter?: any,
        public status?: boolean,
    ) { }
}
