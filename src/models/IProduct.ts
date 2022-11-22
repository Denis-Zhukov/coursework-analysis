import {Id} from "../types/types";

export interface IProduct {
    id: Id;
    name: string;
    description: string;
    categories: string[]
}