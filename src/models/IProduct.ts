import {Id} from "../types/types";

export interface IProduct {
    _id: Id;
    name: string;
    description: string;
    categories: string[]
}