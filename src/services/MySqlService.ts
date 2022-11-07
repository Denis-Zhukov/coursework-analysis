import {IDatabaseService} from "./IDatabaseService";
import mysql, {RowDataPacket} from "mysql2/promise";

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
        return rows;
    }
}