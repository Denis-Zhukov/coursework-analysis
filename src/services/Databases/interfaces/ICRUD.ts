import {Id} from "../../../types/types";

export interface ICRUD<T> {
    add(product: T): any;

    get(count: number, offset: number): any;

    update(product: T): any;

    delete(id: Id): any;
}