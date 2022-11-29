import {Id} from "../types/types";

export interface IAccount {
    id: Id;
    username: string;
    password: string;
    passwordHash: string;
    email: string;
    contactDetails: string;
}