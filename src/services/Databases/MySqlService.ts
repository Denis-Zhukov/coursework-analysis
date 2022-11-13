import {IDatabaseService} from "./IDatabaseService";
import mysql, {RowDataPacket} from "mysql2/promise";
import {IProduct} from "../../models/IProduct";
import {Id} from "../../types/types";
import {logger} from "../../app";

export class MySqlService implements IDatabaseService {
    private pool: mysql.Pool;
    private static _instance: MySqlService;

    public static get instance(): MySqlService {
        return MySqlService._instance;
    }

    private constructor(host: string, port: number, user: string, database: string) {
        this.pool = mysql.createPool({
            host, port, user, database, waitForConnections: true, connectionLimit: 5, queueLimit: 0,
        });
    }

    public static createInstance(host: string, port: number, user: string, database: string): MySqlService {
        if (MySqlService.instance) {
            MySqlService.instance.pool.end().then(() => logger.info("MySql pool has been destroyed"));
        }
        MySqlService._instance = new MySqlService(host, port, user, database);
        return MySqlService.instance;
    }

    public async getProducts(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM products LIMIT ? OFFSET ?";
            const [rows] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return rows as IProduct[];
        } finally {
            connection.release();
        }
    }

    public async addProduct(product: IProduct) {
        const connection = await this.pool.getConnection();
        const query = "INSERT INTO `products` (`name`, `description`) VALUES (?, ?)";
        try {
            const [result] = await connection.execute<mysql.OkPacket>(query, [product.name, product.description]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async deleteProduct(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM products WHERE `products`.`_id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async updateProduct(product: IProduct) {
        const connection = await this.pool.getConnection();

        try {
            const searchId = OldId ? OldId : product._id;
            const query = "UPDATE `products` SET `_id` = ?, `name` = ?, `description` = ? WHERE `products`.`_id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [product._id, product.name, product.description, searchId]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}