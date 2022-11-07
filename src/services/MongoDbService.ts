import {IDatabaseService} from "./IDatabaseService";
import {Products} from "../schemas/Products";
import * as mongoose from "mongoose";
import {IProduct} from "../interfaces/IProduct";
import {logger} from "../app";


export class MongoDbService implements IDatabaseService {
    private static readonly maxPoolSize = 5;
    private readonly url: string;

    public constructor(connectUrl: string) {
        this.url = connectUrl;
        mongoose.createConnection(this.url, {maxPoolSize: MongoDbService.maxPoolSize});
        mongoose
            .connect(String(process.env.MONGODB_URL))
            .catch(err => logger.error(err));
    }

    private checkConnections(): void {
        const connected = mongoose.connections.some(c => c.readyState === 1);
        if (!connected) {
            throw new Error("No one connection have been succeed");
        }
    }

    public async getProducts(count: number, offset: number) {
        this.checkConnections();
        return Products.find().skip(offset).limit(count);
    }

    public async addProduct(product: IProduct) {
        this.checkConnections();
        const prod = new Products({name: product.name, description: product.description});
        const result = await prod.save();
        return result["_id"];
    }

    public async deleteProduct(id: mongoose.Types.ObjectId) {
        this.checkConnections();
        const {deletedCount} = await Products.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }
}