import {ICRUD} from "./interfaces/ICRUD";

export interface IDatabaseStatic {
    registerService(key: string, item: ICRUD<any>): void;
}

export interface IDatabaseInstance {
    getService(key: string): ICRUD<any>;
}