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


interface IShopInfo {
    shopName: string;
    location: ILocation;
    getProducts: string;
    getOrders: string;
}

interface ILocation {
    country: string;
    city: string;
    street: string;
    restOfAddress: string | undefined | null;
}