import {ICRUD} from "./ICRUD";
import {IUserShop} from "../../../models/IUserShop";
import {Id} from "../../../types/types";

export interface IShopService extends ICRUD<IUserShop> {
    addUserShop(userShop: IUserShop): any;

    getUserShops(id: Id, count: number, offset: number): any;

    updateUserShop(userShop: IUserShop): any;

    deleteUserShop(id: Id, idOwner: Id): any;

    count(): any;
}