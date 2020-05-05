export interface Tutor {
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
    hometown?: string;
}

export class TutorDetail implements Tutor {
    constructor(
        public fullName?: string,
        public lastName?: string,
        public address?: string,
        public gender?: number,
        public birthDate?: string,
        public email?: string,
        public phoneNumber?: string,
        public province?: string,
        public country?: string,
        public nationality?: string,
        public dateActivated?: string,
        public id?: string,
        public checked?: boolean,
        public displayName?: string,
        public idCardType?: string,
        public idCardNumber?: string,
        public hometown?: string,
    ) { }
}
