import {IDatabaseService} from "./IDatabaseService";
import {Products} from "../../schemas/Products";
import * as mongoose from "mongoose";
import {IProduct} from "../../models/IProduct";


export class MongoDbService implements IDatabaseService {
    private readonly url: string;

    private static _instance: MongoDbService;

    public static get instance(): MongoDbService {
        return MongoDbService._instance;
    }

    private constructor(connectUrl: string) {
        this.url = connectUrl;
    }

    private async createConnection() {
        await mongoose.connect(this.url, {
            maxPoolSize: 5, connectTimeoutMS: 2500, serverSelectionTimeoutMS: 5000,
        });
    }

    public static createInstance(connectUrl: string): MongoDbService {
        MongoDbService._instance = new MongoDbService(connectUrl);
        return MongoDbService.instance;
    }

    public async getProducts(count: number, offset: number) {
        await this.createConnection();
        const res = await Products.find().skip(offset).limit(count);
        return res;
    }

    public async addProduct(product: IProduct) {
        await this.createConnection();
        const prod = new Products({name: product.name, description: product.description});
        const result = await prod.save();
        return result["_id"];
    }

    public async deleteProduct(id: mongoose.Types.ObjectId) {
        await this.createConnection();
        const {deletedCount} = await Products.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }

    public async updateProduct(product: IProduct) {
        await this.createConnection();
        return Products.updateOne({"_id": new mongoose.Types.ObjectId(product._id)}, {
            name: product.name, description: product.description,
        });
    }
}