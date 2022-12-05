import {Id} from "../types/types";

export interface ICurrentPrice {
    id: Id;
    idProduct: Id;
    idShop: Id;
    price: number;
    update: Date;
}