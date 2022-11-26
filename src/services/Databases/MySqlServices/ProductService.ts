import mysql, {RowDataPacket} from "mysql2/promise";
import {IProduct} from "../../../models/IProduct";
import {MySqlService} from "../MySqlService";
import {ICRUD} from "../interfaces/ICRUD";
import {services} from "../services";
import {Id} from "../../../types/types";
import {RefinedException} from "../../../exceptions/handler/RefinedException";


export class ProductService implements ICRUD<IProduct> {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    private async getIdsCategories(connection: mysql.PoolConnection, product: IProduct) {
        let query = "SELECT id, name FROM `categories` WHERE categories.name IN (";
        query += product.categories.map(() => "?").join(", ") + ")";
        const [categories] = await connection.execute<RowDataPacket[]>(query, product.categories);

        const excluded = product.categories.filter(c => categories.find(el => el.name === c) === undefined);
        const ids: Id[] = categories.map(categories => categories.id);
        const result: [Id[], string[] | null] = [ids, excluded.length ? excluded : null];
        return result;
    }

    private async bindProductAndCategories(connection: mysql.PoolConnection, product: IProduct, idProduct: Id, ids: Id[]): Promise<void> {
        let query = "INSERT INTO `product_categories` (`id_product`, `id_category`) VALUES "
        query += product.categories.map(() => "(?,?)").join(", ");
        const values = ids.map(id => [idProduct, id]).flat();
        await connection.execute<mysql.OkPacket>(query, values);
    }

    public async add(product: IProduct) {
        const connection = await this.pool.getConnection();

        await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await connection.beginTransaction();

        try {
            //add product info to table products
            let query = "INSERT INTO `products` (`name`, `description`) VALUES (?, ?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [product.name, product.description]);
            const idProduct = result.insertId;

            //get ids by current categories
            const [ids, excludedCategories] = await this.getIdsCategories(connection, product);
            if (excludedCategories)
                throw new RefinedException(`Categories: ${excludedCategories.map(c => `'${c}'`).join(', ')} don't exist`, 400);

            //bind categories and product
            await this.bindProductAndCategories(connection, product, idProduct, ids);
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
            const query = "SELECT * FROM `products_info` LIMIT ? OFFSET ?";
            const [rows] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return rows.map(prod => ({...prod, categories: prod.categories.split(';')}));
        } finally {
            connection.release();
        }
    }

    public async update(product: IProduct) {
        const connection = await this.pool.getConnection();

        await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await connection.beginTransaction();

        try {
            //get ids by current categories
            const [ids, excludedCategories] = await this.getIdsCategories(connection, product);
            if (excludedCategories)
                throw new RefinedException(`Categories: ${excludedCategories.map(c => `'${c}'`).join(', ')} don't exist`, 400);

            //delete old bindings
            let query = "DELETE FROM `product_categories` WHERE id_product = ?";
            await connection.execute<mysql.OkPacket>(query, [product.id]);

            //bind categories and product
            await this.bindProductAndCategories(connection, product, product.id, ids);

            //Update product info
            query = "UPDATE `products` SET `name` = ?, `description` = ? WHERE `products`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [product.name, product.description, product.id]);

            await connection.commit();
            
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
            //NOTE: replaced by trigger: BEFORE DELETE in products
            //let query = "DELETE FROM `product_categories` WHERE `id_product` = ?";
            //await connection.execute<mysql.OkPacket>(query, [id]);

            let query = "DELETE FROM products WHERE `products`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.product, new ProductService());