import {IProduct} from "../interfaces/IProduct";
import * as mongoose from "mongoose";

export interface IDatabaseService {
    getProducts(count: number, offset: number): Promise<IProduct[]> | any;

    addProduct(product: IProduct): any;

    deleteProduct(id: number | mongoose.Types.ObjectId): any;
}