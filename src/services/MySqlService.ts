import {IDatabaseService} from "./IDatabaseService";
import mysql, {RowDataPacket} from "mysql2/promise";
import {IProduct} from "../interfaces/IProduct";

export class MySqlService implements IDatabaseService {
    private pool: mysql.Pool;

    public constructor(host: string, port: number, user: string, database: string) {
        this.pool = mysql.createPool({
            host, port, user, database, waitForConnections: true, connectionLimit: 5, queueLimit: 0,
        });
    }

    public async getProducts(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        const query = "SELECT * FROM products LIMIT ? OFFSET ?";
        const [rows] = await connection.execute<RowDataPacket[]>(query, [count, offset]);

        connection.release();
        return rows as IProduct[];
    }

    public async addProduct(product: IProduct) {
        const connection = await this.pool.getConnection();

        const query = "INSERT INTO `products` (`name`, `description`) VALUES (?, ?)";
        const [result] = await connection.execute<mysql.OkPacket>(query, [product.name, product.description]);

        connection.release();
        return result.insertId;
    }

    public async deleteProduct(id: number) {
        const connection = await this.pool.getConnection();

        const query = "DELETE FROM products WHERE `products`.`_id` = ?";
        const [result] = await connection.execute<mysql.OkPacket>(query, [id]);

        return result.affectedRows;
    }
}