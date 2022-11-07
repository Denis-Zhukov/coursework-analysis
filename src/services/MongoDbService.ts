import {IDatabaseService} from "./IDatabaseService";
import {Products} from "../schemas/Products";
import * as mongoose from "mongoose";

export class MongoDbService implements IDatabaseService {
    private static readonly maxPoolSize = 5;
    private readonly url: string;

    public constructor(connectUrl: string) {
        this.url = connectUrl;
        mongoose.createConnection(this.url, {maxPoolSize: MongoDbService.maxPoolSize});
    }

    public async getProducts(count: number, offset: number) {
        await mongoose.connect(this.url);
        return Products.find().skip(offset).limit(count);
    }
}