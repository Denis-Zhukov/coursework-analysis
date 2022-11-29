import {Id} from "../types/types";

export interface IShop {
    id: Id;
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