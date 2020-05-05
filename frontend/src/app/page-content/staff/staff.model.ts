import { User } from '@app/app.models';

export interface Staff {
    fullName?: string;
    lastName?: string;
    address?: string;
    gender?: number;
    birthDate?: string;
    email?: string;
    phoneNumber?: string;
    province?: string;
    country?: string;
    nationality?: string;
    dateActivated?: string;
    id?: string;
    checked?: boolean;
    displayName?: string;
    idCardType?: string;
    idCardNumber?: string;
}

export class StaffDetail implements User {
    constructor(
        public id?: number,
        public avatar?: string,
        public birthDate?: string,
        public email?: string,
        public fullName?: string,
        public lastName?: string,
        public gender?: string,
        public hometown?: string,
        public role?: string,
        public department?: any,
        public groupPermission?: any,
        public checked?: boolean,
        public address?: string,
        public phoneNumber?: string,
    ) { }
}
