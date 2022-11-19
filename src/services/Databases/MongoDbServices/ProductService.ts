import mysql, {RowDataPacket} from "mysql2/promise";
import {IProduct} from "../../../models/IProduct";
import {MySqlService} from "../MySqlService";
import {ICRUD} from "../interfaces/ICRUD";
import {Products} from "../../../schemas/Products";
import mongoose from "mongoose";
import {MongoDbService} from "../MongoDbService";
import {tableName} from "../tableName";

export class ProductService implements ICRUD<IProduct> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(product: IProduct) {
        await this.instance.getConnection();
        const prod = new Products({name: product.name, description: product.description});
        const result = await prod.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Products.find().skip(offset).limit(count);
    }

    public async update(product: IProduct) {
        await this.instance.getConnection();
        return Products.updateOne({"_id": new mongoose.Types.ObjectId(product._id)}, {
            name: product.name, description: product.description,
        });
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Products.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }
}

MongoDbService.register(tableName.product, new ProductService());