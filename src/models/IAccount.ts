import {Id} from "../types/types";

export interface IAccount {
    id: Id;
    username: string;
    passwordHash: string;
    email: string;
    contactDetails: string;
}