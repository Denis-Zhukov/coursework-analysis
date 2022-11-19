import * as mongoose from "mongoose";
import {IDatabaseStatic, IDatabaseInstance} from "./IDatabase";
import {ICRUD} from "./interfaces/ICRUD";
import {staticImplement} from "../../decorators/staticImplement";

@staticImplement<IDatabaseStatic>()
export class MongoDbService implements IDatabaseInstance {
    public readonly url: string;
    private static _instance: MongoDbService;
    private static tables = new Map<String, ICRUD<any>>();

    public static get instance(): MongoDbService {
        return MongoDbService._instance;
    }

    private constructor(connectionUrl: string) {
        this.url = connectionUrl;
    }

    public async getConnection(): Promise<void> {
        await mongoose.connect(this.url, {
            maxPoolSize: 5,
            connectTimeoutMS: 2500,
            serverSelectionTimeoutMS: 5000,
        });
    }

    public static createInstance(connectUrl: string): MongoDbService {
        MongoDbService._instance = new MongoDbService(connectUrl);
        return MongoDbService.instance;
    }

    public static register(key: string, item: ICRUD<any>): void {
        if (MongoDbService.tables.has(key))
            throw new Error(`Table with key ${key} already exists`);

        MongoDbService.tables.set(key, item);
    }

    public table(key: string): ICRUD<any> {
        if (!MongoDbService.tables.has(key))
            throw new Error(`Table with key ${key} doesn't exist`);

        return MongoDbService.tables.get(key)!;
    }
}