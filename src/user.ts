import * as mongodb from 'mongodb';

export interface User {
    name: string;
    email: string;
    genre: 'woman' | 'men' | 'other';
    _id?: mongodb.ObjectId;
}