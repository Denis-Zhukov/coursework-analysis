import mysql, {RowDataPacket} from "mysql2/promise";
import {MySqlService} from "../MySqlService";
import {services} from "../services";
import {IShop} from "../../../models/IShop";
import {IShopService} from "../interfaces/IShop";
import {IUserShop} from "../../../models/IUserShop";
import {RefinedException} from "../../../exceptions/handler/RefinedException";


export class ShopService implements IShopService {
    private pool: mysql.Pool;

    constructor() {
        this.pool = MySqlService.instance.pool;
    }

    public async add(shop: IShop) {
        const connection = await this.pool.getConnection();

        try {
            let query = "INSERT INTO `shops`(`name`, `address`, `getProducts`, `getOrders`) VALUES (?,?,?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [shop.name, shop.address, shop.getProducts, shop.getOrders]);
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    public async addUserShop(shop: IUserShop) {
        const connection = await this.pool.getConnection();

        await connection.execute("SET TRANSACTION ISOLATION LEVEL READ COMMITTED");
        await connection.beginTransaction();
        try {
            let query = "INSERT INTO `shops`(`name`, `address`, `getProducts`, `getOrders`) VALUES (?,?,?,?)";
            const [result] = await connection.execute<mysql.OkPacket>(query, [shop.name, shop.address, shop.getProducts, shop.getOrders]);

            query = "INSERT INTO `account_shop`(`id_account`, `id_shop`) VALUES (?, ?)";
            await connection.execute<mysql.OkPacket>(query, [shop.accountId, result.insertId]);

            await connection.commit();
            return result.insertId;
        } catch (e) {
            await connection.rollback();
            throw e;
        } finally {
            connection.release();
        }
    }

    public async get(count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `shops` LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async getUserShops(id: number, count: number, offset: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "SELECT * FROM `accounts_shop_info` WHERE id_owner = ? LIMIT ? OFFSET ?";
            const [categories] = await connection.execute<RowDataPacket[]>(query, [id, count, offset]);
            return categories;
        } finally {
            connection.release();
        }
    }

    public async update(shop: IShop) {
        const connection = await this.pool.getConnection();

        try {
            const query = "UPDATE `shops` SET `name`=?,`address`=?,`getProducts`=?,`getOrders`=? WHERE id=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [shop.name, shop.address, shop.getProducts, shop.getOrders, shop.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async updateUserShop(shop: IUserShop) {
        const connection = await this.pool.getConnection();

        try {
            let query = "SELECT id_owner FROM `accounts_shop_info` WHERE id_shop=?";
            const [rows] = await connection.execute<mysql.RowDataPacket[]>(query, [shop.id]);
            if (!rows.length)
                throw new RefinedException(`Shop with ${shop.id} doesn't exist or hasn't owner`, 400);
            if ((rows[0] as any).id_owner !== shop.accountId)
                throw new RefinedException(`You aren't owner by shop ${shop.id}`, 400);

            query = "UPDATE `shops` SET `name`=?,`address`=?,`getProducts`=?,`getOrders`=? WHERE id=?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [shop.name, shop.address, shop.getProducts, shop.getOrders, shop.id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async delete(id: number) {
        const connection = await this.pool.getConnection();

        try {
            const query = "DELETE FROM `shops` WHERE `shops`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }

    public async deleteUserShop(id: number, idOwner: number) {
        const connection = await this.pool.getConnection();

        try {
            let query = "SELECT id_owner FROM `accounts_shop_info` WHERE id_shop=?";
            const [rows] = await connection.execute<mysql.RowDataPacket[]>(query, [id]);
            if (!rows.length)
                throw new RefinedException(`Shop with ${id} doesn't exist or hasn't owner`, 400);
            if ((rows[0] as any).id_owner !== idOwner)
                throw new RefinedException(`You aren't owner by shop ${id}`, 400);

            query = "DELETE FROM `shops` WHERE `shops`.`id` = ?";
            const [result] = await connection.execute<mysql.OkPacket>(query, [id]);
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

MySqlService.registerService(services.shop, new ShopService());