import {Id} from "../types/types";

export interface IShop {
    id: Id;
    name: string;
    address: Id;
    getProducts: string;
    getOrders: string;
}