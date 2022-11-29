import {Id} from "../types/types";

export interface IRegisterData {
    id: Id;
    username: string;
    password: string;
    passwordHash: string;
    email: string;
    contactDetails: string;
    token: string;
    confirmed: boolean;
}