import mysql from "mysql2/promise";
import {IDatabaseInstance, IDatabaseStatic} from "./IDatabase";
import {ICRUD} from "./interfaces/ICRUD";
import {staticImplement} from "../../decorators/staticImplement";


@staticImplement<IDatabaseStatic>()
export class MySqlService implements IDatabaseInstance {
    public readonly pool: mysql.Pool;
    private static _instance: MySqlService;
    private static services = new Map<String, ICRUD<any>>();

    public static get instance(): MySqlService {
        return MySqlService._instance;
    }

    private constructor(host: string, port: number, user: string, database: string) {
        this.pool = mysql.createPool({
            host, port, user, database,
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0,
        });
    }

    public getService(key: string): ICRUD<any> {
        if (!MySqlService.services.has(key))
            throw new Error(`Service with key ${key} doesn't exist`);

        return MySqlService.services.get(key)!;
    }

    public static registerService(key: string, item: ICRUD<any>): void {
        if (MySqlService.services.has(key))
            throw new Error(`Service with key ${key} already exists`);

        MySqlService.services.set(key, item);
    }

    public static createInstance(host: string, port: number, user: string, database: string): MySqlService {
        if(MySqlService.instance)
            MySqlService.instance.pool.end().then(() => console.log("MySql pool has been destroyed"));
        MySqlService._instance = new MySqlService(host, port, user, database);
        return MySqlService.instance;
    }
}