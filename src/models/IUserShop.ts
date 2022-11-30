import {Id} from "../types/types";
import {IShop} from "./IShop";

export interface IUserShop extends IShop {
    accountId: Id
}