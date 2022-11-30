import {IAccount} from "../../../models/IAccount";
import {ICRUD} from "./ICRUD";

export interface IAccountService extends ICRUD<IAccount> {
    getByUsername(username: string): any;
}