import * as mongoose from "mongoose";
import {IDatabaseInstance, IDatabaseStatic} from "./IDatabase";
import {ICRUD} from "./interfaces/ICRUD";
import {staticImplement} from "../../decorators/staticImplement";


@staticImplement<IDatabaseStatic>()
export class MongoDbService implements IDatabaseInstance {
    public readonly url: string;
    private static _instance: MongoDbService;
    private static services = new Map<String, ICRUD<any>>();

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

    public getService(key: string): ICRUD<any> {
        if (!MongoDbService.services.has(key))
            throw new Error(`Service with key ${key} doesn't exist`);

        return MongoDbService.services.get(key)!;
    }

    public static registerService(key: string, item: ICRUD<any>): void {
        if (MongoDbService.services.has(key))
            throw new Error(`Service with key ${key} already exists`);

        MongoDbService.services.set(key, item);
    }

    public static createInstance(connectUrl: string): MongoDbService {
        MongoDbService._instance = new MongoDbService(connectUrl);
        return MongoDbService.instance;
    }
}