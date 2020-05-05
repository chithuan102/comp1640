export interface Student {
    fullName?: string;
    lastName?: string;
    address?: string;
    gender?: string;
    birthDate?: string;
    email?: string;
    phoneNumber?: string;
    province?: string;
    country?: string;
    nationality?: string;
    id?: string;
    idCardNumber?: string;
    idCardType?: string;
    checked?: boolean;
    tutorId?: string;
    tutorName?: string;
    major?: string;
    isActivated?: boolean;
}

export class StudentDetail implements Student {
    constructor(
        public fullName?: string,
        public lastName?: string,
        public address?: string,
        public gender?: string,
        public birthDate?: string,
        public email?: string,
        public phoneNumber?: string,
        public province?: string,
        public country?: string,
        public nationality?: string,
        public id?: string,
        public idCardNumber?: string,
        public idCardType?: string,
        public tutorId?: string,
        public tutorName?: string,
        public checked?: boolean,
        public isActivated?: boolean,
        public major?: string,
    ) { }
}
