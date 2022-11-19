import mysql from "mysql2/promise";
import {logger} from "../../app";
import {IDatabaseStatic, IDatabaseInstance} from "./IDatabase";
import {ICRUD} from "./interfaces/ICRUD";
import {staticImplement} from "../../decorators/staticImplement";

@staticImplement<IDatabaseStatic>()
export class MySqlService implements IDatabaseInstance {
    public readonly pool: mysql.Pool;
    private static _instance: MySqlService;
    private static tables = new Map<String, ICRUD<any>>();

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

    public static createInstance(host: string, port: number, user: string, database: string): MySqlService {
        MySqlService.instance &&
        MySqlService.instance.pool.end().then(() => logger.info("MySql pool has been destroyed"));
        MySqlService._instance = new MySqlService(host, port, user, database);
        return MySqlService.instance;
    }

    public static register(key: string, item: ICRUD<any>): void {
        if (MySqlService.tables.has(key))
            throw new Error(`Table with key ${key} already exists`);

        MySqlService.tables.set(key, item);
    }

    public table(key: string): ICRUD<any> {
        if (!MySqlService.tables.has(key))
            throw new Error(`Table with key ${key} doesn't exist`);

        return MySqlService.tables.get(key)!;
    }
}