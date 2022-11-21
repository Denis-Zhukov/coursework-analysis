import mysql, {RowDataPacket} from "mysql2/promise";
import {IProduct} from "../../../models/IProduct";
import {MySqlService} from "../MySqlService";
import {ICRUD} from "../interfaces/ICRUD";
import {services} from "../services";


export class ProductService implements ICRUD<IProduct> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(product: IProduct) {
        const connection = await this.pool.getConnection();

        await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await connection.beginTransaction();

        try {
            //add all categories from product to table categories
            let query = "INSERT IGNORE INTO `categories` (`name`) VALUES ";
            query += product.categories.map(() => "(?)").join(", ");
            await connection.execute<mysql.OkPacket>(query, product.categories);

            //add product info to table products
            query = "INSERT INTO `products` (`name`, `description`) VALUES (?, ?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [product.name, product.description]);
            const idProduct = result.insertId;

            //get ids by current categories
            query = "SELECT id FROM `categories` WHERE categories.name IN (";
            query += product.categories.map(() => "?").join(", ") + ")";
            const [idsObject] = await connection.execute<RowDataPacket[]>(query, product.categories);
            const ids: number[] = idsObject.map(idObject => idObject.id);

            //bind categories and product
            query = "INSERT INTO `product_categories` (`id_product`, `id_category`) VALUES "
            query += product.categories.map(() => "(?,?)").join(", ");
            const values = ids.map(id=>[idProduct, id]).flat();
            await connection.execute<mysql.OkPacket>(query, values);

            await connection.commit();

            return idProduct;
        } catch (e: any) {
            await connection.rollback();
            throw e;
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

        await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await connection.beginTransaction();

        try {
            //add all categories from product to table categories
            let query = "INSERT IGNORE INTO `categories` (`name`) VALUES ";
            query += product.categories.map(() => "(?)").join(", ");
            await connection.execute<mysql.OkPacket>(query, product.categories);

            //get ids by current categories
            query = "SELECT id FROM `categories` WHERE categories.name IN (";
            query += product.categories.map(() => "?").join(", ") + ")";
            const [idsObject] = await connection.execute<RowDataPacket[]>(query, product.categories);
            const ids: number[] = idsObject.map(idObject => idObject.id);

            //bind categories and product
            query = "INSERT INTO `product_categories` (`id_product`, `id_category`) VALUES "
            query += product.categories.map(() => "(?,?)").join(", ");
            const values = ids.map(id=>[product._id, id]).flat();
            await connection.execute<mysql.OkPacket>(query, values);


            query = "UPDATE `products` SET `name` = ?, `description` = ? WHERE `products`.`_id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [product.name, product.description, product._id]);
            return result.affectedRows;
        } catch (e: any) {
            await connection.rollback();
            throw e;
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

MySqlService.registerService(services.product, new ProductService());