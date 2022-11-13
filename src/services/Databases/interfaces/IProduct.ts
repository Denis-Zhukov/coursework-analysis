import {Id} from "../../../types/types";
import {IProduct as IProductModel} from "../../../models/IProduct";

export interface IProduct {
    addProduct(product: IProductModel): any;

    getProducts(count: number, offset: number): any;

    updateProduct(product: IProductModel): any;

    deleteProduct(id: Id): any;
}