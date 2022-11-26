import {Id} from "../../../types/types";

export interface ICRUD<T> {
    add(item: T): any;

    get(count: number, offset: number): any;

    update(item: T): any;

    delete(id: Id): any;
}