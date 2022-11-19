import mysql, {RowDataPacket} from "mysql2/promise";
import {IProduct} from "../../../models/IProduct";
import {MySqlService} from "../MySqlService";
import {ICRUD} from "../interfaces/ICRUD";
import {tableName} from "../tableName";


export class ProductService implements ICRUD<IProduct> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(product: IProduct) {
        const connection = await this.pool.getConnection();

        await connection.execute('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        await connection.beginTransaction();

        try {
            //add all categories from product to table categories
            let query = "INSERT IGNORE INTO `categories` (`name`) VALUES ";
            query += product.categories.map(() => "(?)").join(', ');
            await connection.execute<mysql.OkPacket>(query, [...product.categories]);

            //add product info to table products
            query = "INSERT INTO `products` (`name`, `description`) VALUES (?, ?)";
            await connection.execute<mysql.OkPacket>(query, [product.name, product.description]);

            //bind categories and current product
            query = "SELECT * FROM `categories` WHERE categories.id IN ("
            query += product.categories.map(() => "?").join(', ') + ")";

            await connection.commit();
            const result: any = {};
            return result.insertId;
        } catch {
            await connection.rollback();
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM products LIMIT ? OFFSET ?";
            const [rows] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return rows as IProduct[];
        } finally {
            connection.release();
        }
    }

    public async update(product: IProduct) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `products` SET `name` = ?, `description` = ? WHERE `products`.`_id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [product.name, product.description, product._id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM products WHERE `products`.`_id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.register(tableName.product, new ProductService());