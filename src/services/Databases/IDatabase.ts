import {ICRUD} from "./interfaces/ICRUD";

export interface IDatabaseStatic {
    register(key: string, item: ICRUD<any>): void;
}

export interface IDatabaseInstance {
    table(key: string): ICRUD<any>;
}