import {ICRUD} from "./ICRUD";
import {ICurrentPrice} from "../../../models/ICurrentPrice";

export interface ICurrentPricesService extends ICRUD<ICurrentPrice> {
    addMany(data: ICurrentPrice[]): any;

    getByIdProductAndIdShop(count: number, offset: number, idProduct: number, idShop: number): any;

    deleteIdProductAndByIdShop(idProduct: number, idShop: number): any;
}