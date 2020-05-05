import { UserDetail } from '@app/app.models';

export interface Blog {
    title?: string;
    content?: string;
    description?: string;
    thumbnail?: string;
    shortDescription?: string;
    username?: string;
    linkFile?: string;
    type?: string;
    user?: UserDetail;
    comments: Comment[];
    id?: number;
    createdAt?: string;
}


export interface Comment {
    name: string;
    content: string;
    children: Comment[];
}

export class BlogObject implements Blog {
    title?: string;
    content?: string;
    description?: string;
    thumbnail?: string;
    shortDescription?: string;
    username?: string;
    linkFile?: string;
    type?: string;
    user?: UserDetail;
    comments: Comment[];
    id?: number;
    createdAt?: string;



}